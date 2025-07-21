from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..models import SearchHistory
from db import get_db
from ..schema import SearchHistoryCreate
from auth import get_current_user
from ..models import User

router = APIRouter()

@router.post("/search-history/")
def save_search(data: SearchHistoryCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    search = SearchHistory(user_id=user.id, query=data.query)
    db.add(search)
    db.commit()
    db.refresh(search)
    return search
