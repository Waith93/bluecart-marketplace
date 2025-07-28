from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from app.models import User
from app.schema import UserCreate, UserLogin, Token, UserProfile, ProfileUpdateRequest
from app.database import get_db
from app.config import settings
from pydantic import BaseModel  

router = APIRouter(tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"  
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


class ResetPasswordRequest(BaseModel):
    username: str
    email: str
    new_password: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/signup", response_model=Token)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter((User.email == user.email) | (User.username == user.username)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already registered.")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, email=user.email, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"sub": new_user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    
    token = create_access_token(data={"sub": db_user.email})  # ← Use EMAIL
    return {"access_token": token, "token_type": "bearer"}

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.username == data.username,
        User.email == data.email
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user.password_hash = get_password_hash(data.new_password)
    db.commit()

    return {"detail": "Password reset successful."}

@router.get("/profile", response_model=UserProfile)
def get_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/profile", response_model=UserProfile)
def update_user_profile(
    profile_data: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_data.username != current_user.username:
        existing_username = db.query(User).filter(
            User.username == profile_data.username,
            User.id != current_user.id
        ).first()
        if existing_username:
            raise HTTPException(status_code=400, detail="Username already taken.")
    
    if profile_data.email != current_user.email:
        existing_email = db.query(User).filter(
            User.email == profile_data.email,
            User.id != current_user.id
        ).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already in use.")
    
    current_user.username = profile_data.username
    current_user.email = profile_data.email
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

