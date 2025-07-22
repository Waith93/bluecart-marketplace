from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, Numeric
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    search_history = relationship("SearchHistory", back_populates="user")
    favorites = relationship("FavoriteProduct", back_populates="user")


class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    query_text = Column(String(255), nullable=False)
    searched_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="search_history")
    products = relationship("Product", back_populates="search")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    search_id = Column(Integer, ForeignKey("search_history.id"))
    external_product_id = Column(String(255))
    product_name = Column(String(255), nullable=False)
    platform = Column(String(50), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    delivery_cost = Column(Numeric(10, 2))
    payment_mode = Column(String(50))
    rating = Column(Float)
    rating_count = Column(Integer)
    product_url = Column(Text)
    mb_score = Column(Float)
    cb_score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)

    search = relationship("SearchHistory", back_populates="products")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    external_product_id = Column(String(255))
    product_name = Column(String(255))
    platform = Column(String(50))
    author_name = Column(String(100))
    rating = Column(Float)
    content = Column(Text)
    source = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)


class FavoriteProduct(Base):
    __tablename__ = "favorite_products"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    external_product_id = Column(String(255), primary_key=True)
    product_name = Column(String(255))
    platform = Column(String(50))
    price = Column(Numeric(10, 2))
    saved_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="favorites")
