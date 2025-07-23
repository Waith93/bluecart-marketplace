from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime, timedelta
from app.models import Product, Review
from app.schemas import SearchFilters, SearchResponse, ProductResponse, ReviewResponse
from app.database import get_session

router = APIRouter()

def calculate_time_ago(created_at: datetime) -> str:
    delta = datetime.utcnow() - created_at
    if delta.days >= 30:
        return f"{delta.days // 30} month ago"
    elif delta.days >= 1:
        return f"{delta.days} days ago"
    else:
        return f"{delta.seconds // 3600} hours ago"

@router.post("/search", response_model=SearchResponse)
def search_products(filters: SearchFilters, session: Session = Depends(get_session)):
    product_query = session.query(Product)

    if filters.keyword:
        product_query = product_query.filter(Product.product_name.ilike(f"%{filters.keyword}%"))

    if filters.min_price is not None:
        product_query = product_query.filter(Product.price >= filters.min_price)
    if filters.max_price is not None:
        product_query = product_query.filter(Product.price <= filters.max_price)

    if filters.min_rating is not None:
        product_query = product_query.filter(Product.rating >= filters.min_rating)

    if filters.platforms:
        product_query = product_query.filter(Product.platform.in_(filters.platforms))

    products = product_query.all()

    product_response = [
        ProductResponse(
            platform=prod.platform,
            product_name=prod.product_name,
            price=prod.price,
            delivery_cost=prod.delivery_cost,
            rating=prod.rating,
            cb_score=prod.cb_score,
            mb_ratio=prod.mb_score  # Rename appropriately if needed
        )
        for prod in products
    ]

    # --- Optional Reviews ---
    reviews_query = session.query(Review)
    if filters.platforms:
        reviews_query = reviews_query.filter(Review.platform.in_(filters.platforms))
    reviews = reviews_query.order_by(Review.created_at.desc()).limit(10).all()

    review_response = [
        ReviewResponse(
            platform=rev.platform,
            reviewer=rev.reviewer_name,
            rating=rev.rating,
            time_ago=calculate_time_ago(rev.created_at),
            comment=rev.comment
        )
        for rev in reviews
    ]

    return SearchResponse(products=product_response, reviews=review_response)
