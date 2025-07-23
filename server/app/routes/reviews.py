from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..models import Review
from ..models import User
from db import get_db
from ..schema import ReviewCreate
from auth import get_current_user

router = APIRouter()

@router.post("/reviews/")
def create_review(data: ReviewCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    review = Review(user_id=user.id, **data.dict())
    db.add(review)
    db.commit()
    db.refresh(review)
    return review
