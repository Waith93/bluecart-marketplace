from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

# USER SCHEMAS

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str


# SEARCH HISTORY SCHEMAS

class SearchHistoryBase(BaseModel):
    query_text: str

class SearchHistoryCreate(SearchHistoryBase):
    user_id: int

class SearchHistoryOut(SearchHistoryBase):
    id: int
    searched_at: datetime
    user_id: int

    class Config:
        orm_mode = True


# ==============================
# PRODUCT SCHEMAS
# ==============================

class ProductBase(BaseModel):
    external_product_id: Optional[str]
    product_name: str
    platform: str
    price: Decimal
    delivery_cost: Optional[Decimal] = None
    payment_mode: Optional[str] = None
    rating: Optional[float] = None
    rating_count: Optional[int] = None
    product_url: Optional[str] = None
    mb_score: Optional[float] = None
    cb_score: Optional[float] = None
    expires_at: Optional[datetime] = None

class ProductCreate(ProductBase):
    search_id: int

class ProductOut(ProductBase):
    id: int
    search_id: int
    created_at: datetime

    class Config:
        orm_mode = True


# REVIEW SCHEMAS

class ReviewBase(BaseModel):
    external_product_id: str
    product_name: str
    platform: str
    author_name: Optional[str]
    rating: Optional[float]
    content: Optional[str]
    source: Optional[str]

class ReviewCreate(ReviewBase):
    pass

class ReviewOut(ReviewBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# FAVORITE PRODUCT SCHEMAS

class FavoriteProductBase(BaseModel):
    external_product_id: str
    product_name: str
    platform: str
    price: Decimal

class FavoriteProductCreate(FavoriteProductBase):
    user_id: int

class FavoriteProductOut(FavoriteProductBase):
    user_id: int
    saved_at: datetime

    class Config:
        orm_mode = True

class FavoriteProduct(FavoriteProductOut):
    id: int

    class Config:
        orm_mode = True

class ProductDetail(ProductOut):
    reviews: List[ReviewOut] = []