from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

from app.models import User
from app.schemas import UserCreate, UserLogin, Token
from app.database import get_db
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Secret key and token settings
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "BCM9878"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register", response_model=Token)
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
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    
    token = create_access_token(data={"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}
