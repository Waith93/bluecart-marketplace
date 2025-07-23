from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from app.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/favorites", tags=["favorites"])

@router.get("/", response_model=list[schemas.FavoriteProduct])
def get_favorites(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.FavoriteProduct).filter_by(user_id=current_user.id).all()

@router.post("/", response_model=schemas.FavoriteProduct)
def add_favorite(fav: schemas.FavoriteProductCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    existing = db.query(models.FavoriteProduct).filter_by(
        user_id=current_user.id,
        external_product_id=fav.external_product_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Product already in favorites.")

    new_fav = models.FavoriteProduct(
        user_id=current_user.id,
        external_product_id=fav.external_product_id,
        product_name=fav.product_name,
        platform=fav.platform,
        price=fav.price,
        saved_at=datetime.utcnow()
    )
    db.add(new_fav)
    db.commit()
    db.refresh(new_fav)
    return new_fav

@router.delete("/{external_product_id}", status_code=204)
def remove_favorite(external_product_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    fav = db.query(models.FavoriteProduct).filter_by(
        user_id=current_user.id,
        external_product_id=external_product_id
    ).first()

    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found.")

    db.delete(fav)
    db.commit()
