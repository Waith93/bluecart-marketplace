from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app import models, schemas
from datetime import datetime
from .utils import calculate_cb, calculate_mb


# User CRUD Operations
def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=user.password_hash
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


# Search History CRUD Operations
def create_search_history(db: Session, user_id: int, query_text: str):
    search = models.SearchHistory(user_id=user_id, query_text=query_text)
    db.add(search)
    db.commit()
    db.refresh(search)
    return search


def get_user_search_history(db: Session, user_id: int):
    return db.query(models.SearchHistory).filter(models.SearchHistory.user_id == user_id).order_by(models.SearchHistory.searched_at.desc()).all()


# product CRUD Operations
def create_product(db: Session, product: schemas.ProductCreate):
    product_data = product.dict()
    product_data["cb_score"] = calculate_cb(product_data)
    product_data["mb_score"] = calculate_mb(product_data)
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def get_products_by_search_id(db: Session, search_id: int):
    return db.query(models.Product).filter(models.Product.search_id == search_id).all()


def get_product_by_external_id(db: Session, external_id: str):
    return db.query(models.Product).filter(models.Product.external_product_id == external_id).first()


# Review CRUD Operations
def create_review(db: Session, review: schemas.ReviewCreate):
    db_review = models.Review(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review


def get_reviews_for_product(db: Session, external_product_id: str):
    return db.query(models.Review).filter(models.Review.external_product_id == external_product_id).all()


# Favorite CRUD Operations
def add_to_favorites(db: Session, favorite: schemas.FavoriteProductCreate):
    db_favorite = models.FavoriteProduct(**favorite.dict())
    db.add(db_favorite)
    try:
        db.commit()
        db.refresh(db_favorite)
        return db_favorite
    except IntegrityError:
        db.rollback()
        return None 


def get_user_favorites(db: Session, user_id: int):
    return db.query(models.FavoriteProduct).filter(models.FavoriteProduct.user_id == user_id).all()


def remove_from_favorites(db: Session, user_id: int, external_product_id: str):
    favorite = db.query(models.FavoriteProduct).filter(
        models.FavoriteProduct.user_id == user_id,
        models.FavoriteProduct.external_product_id == external_product_id
    ).first()
    if favorite:
        db.delete(favorite)
        db.commit()
    return favorite
