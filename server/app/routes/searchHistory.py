from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..models import SearchHistory
from app.database import get_db
from ..schema import SearchHistoryCreate, SearchHistoryOut  # Import output schema if defined
from app.routes.auth import get_current_user
from ..models import User

router = APIRouter(tags=["SearchHistory"])

@router.post("/", response_model=SearchHistoryOut)  # Changed to "/" and added response_model
def save_search(data: SearchHistoryCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    search = SearchHistory(user_id=user.id, query=data.query)
    db.add(search)
    db.commit()
    db.refresh(search)
    return search
