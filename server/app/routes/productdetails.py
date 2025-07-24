from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app import models
from app.schema import ProductDetail 

router = APIRouter(tags=["ProductDetails"])

@router.get("/{product_id}", response_model=ProductDetail)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(models.Product)\
        .options(joinedload(models.Product.reviews))\
        .filter(models.Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return product
