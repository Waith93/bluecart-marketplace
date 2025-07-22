from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models import Product
from app.schemas import SearchFilters, ProductResponse
from app.database import get_session

router = APIRouter()

@router.post("/search", response_model=list[ProductResponse])
def search_products(filters: SearchFilters, session: Session = Depends(get_session)):
    query = select(Product)

    # Keyword search
    if filters.keyword:
        query = query.where(Product.name.ilike(f"%{filters.keyword}%"))

    # Price filter
    query = query.where(Product.price >= filters.min_price, Product.price <= filters.max_price)

    # Rating filter
    query = query.where(Product.rating >= filters.min_rating)

    # Platform filter
    if filters.platforms:
        query = query.where(Product.platform.in_(filters.platforms))

    results = session.exec(query).all()
    return results
