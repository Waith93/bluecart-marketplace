from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schema import ProductOut

router = APIRouter(tags=["ProductDetails"])  # Added tags to match main.py

@router.get("/{product_id}", response_model=ProductOut)  # Changed to "/{product_id}"
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
