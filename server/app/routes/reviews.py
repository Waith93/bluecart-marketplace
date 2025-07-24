from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models import Review, Product
from ..database import get_db
from ..schema import ReviewOut

router = APIRouter(tags=["Reviews"])

@router.get("/product/{product_id}", response_model=list[ReviewOut])
def get_reviews_for_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return db.query(Review).filter(Review.product_id == product_id).all()
