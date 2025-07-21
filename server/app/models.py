from datetime import datetime
import sqlalchemy
from sqlalchemy import (
    Column, Integer, String, Float, ForeignKey, DateTime, Numeric, Text
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    search_history = relationship('SearchHistory', back_populates='user', cascade='all, delete-orphan')
    favorite_products = relationship('FavoriteProduct', back_populates='user', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<User {self.username}>"


class SearchHistory(Base):
    __tablename__ = 'search_history'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    query_text = Column(String(255), nullable=False)
    searched_at = Column(DateTime, default=datetime.utcnow)

    user = relationship('User', back_populates='search_history')
    products = relationship('Product', back_populates='search', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<SearchHistory {self.query_text}>"


class Product(Base):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True)
    search_id = Column(Integer, ForeignKey('search_history.id'))
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

    search = relationship('SearchHistory', back_populates='products')

    def __repr__(self):
        return f"<Product {self.product_name} - {self.platform}>"


class Review(Base):
    __tablename__ = 'reviews'

    id = Column(Integer, primary_key=True)
    external_product_id = Column(String(255))
    product_name = Column(String(255))
    platform = Column(String(50))
    author_name = Column(String(100))
    rating = Column(Float)
    content = Column(Text)
    source = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Review {self.product_name} by {self.author_name}>"


class FavoriteProduct(Base):
    __tablename__ = 'favorite_products'

    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    external_product_id = Column(String(255), primary_key=True)
    product_name = Column(String(255))
    platform = Column(String(50))
    price = Column(Numeric(10, 2))
    saved_at = Column(DateTime, default=datetime.utcnow)

    user = relationship('User', back_populates='favorite_products')

    def __repr__(self):
        return f"<FavoriteProduct {self.product_name} by User {self.user_id}>"

