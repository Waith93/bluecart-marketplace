from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, nullable=False, max_length=50)
    email: str = Field(index=True, nullable=False, max_length=100)
    password_hash: str = Field(nullable=False, max_length=255)

    search_history: List["SearchHistory"] = Relationship(back_populates="user")
    favorite_products: List["FavoriteProduct"] = Relationship(back_populates="user")


class SearchHistory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    query_text: str = Field(nullable=False, max_length=255)
    searched_at: datetime = Field(default_factory=datetime.utcnow)

    user: User = Relationship(back_populates="search_history")
    products: List["Product"] = Relationship(back_populates="search")


class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    search_id: Optional[int] = Field(foreign_key="searchhistory.id")
    external_product_id: Optional[str] = Field(default=None, max_length=255)
    product_name: str = Field(nullable=False, max_length=255)
    platform: str = Field(nullable=False, max_length=50)
    price: float = Field(nullable=False)
    delivery_cost: Optional[float] = None
    payment_mode: Optional[str] = Field(default=None, max_length=50)
    rating: Optional[float] = None
    rating_count: Optional[int] = None
    product_url: Optional[str] = None
    mb_score: Optional[float] = None
    cb_score: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None

    search: Optional[SearchHistory] = Relationship(back_populates="products")


class Review(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    external_product_id: Optional[str] = Field(default=None, max_length=255)
    product_name: Optional[str] = Field(default=None, max_length=255)
    platform: Optional[str] = Field(default=None, max_length=50)
    author_name: Optional[str] = Field(default=None, max_length=100)
    rating: Optional[float] = None
    content: Optional[str] = None
    source: Optional[str] = Field(default=None, max_length=50)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class FavoriteProduct(SQLModel, table=True):
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    external_product_id: str = Field(primary_key=True, max_length=255)
    product_name: Optional[str] = None
    platform: Optional[str] = Field(default=None, max_length=50)
    price: Optional[float] = None
    saved_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="favorite_products")
