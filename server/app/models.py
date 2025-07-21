from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from sqlalchemy.orm import validates

db = SQLAlchemy()
bcrypt = Bcrypt()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    search_history = db.relationship('SearchHistory', backref='user', cascade='all, delete-orphan')
    favorite_products = db.relationship('FavoriteProduct', backref='user', cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }

    def __repr__(self):
        return f"<User {self.username}>"


class SearchHistory(db.Model):
    __tablename__ = 'search_history'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    query_text = db.Column(db.String(255), nullable=False)
    searched_at = db.Column(db.DateTime, default=datetime.utcnow)

    products = db.relationship('Product', backref='search', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "id": self.id,
            "query_text": self.query_text,
            "searched_at": self.searched_at.isoformat()
        }

    def __repr__(self):
        return f"<SearchHistory {self.query_text}>"


class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    search_id = db.Column(db.Integer, db.ForeignKey('search_history.id'))
    external_product_id = db.Column(db.String(255))
    product_name = db.Column(db.String(255), nullable=False)
    platform = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    delivery_cost = db.Column(db.Numeric(10, 2))
    payment_mode = db.Column(db.String(50))
    rating = db.Column(db.Float)
    rating_count = db.Column(db.Integer)
    product_url = db.Column(db.Text)
    mb_score = db.Column(db.Float)
    cb_score = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime)

    def to_dict(self):
        return {
            "id": self.id,
            "external_product_id": self.external_product_id,
            "product_name": self.product_name,
            "platform": self.platform,
            "price": float(self.price),
            "delivery_cost": float(self.delivery_cost or 0),
            "payment_mode": self.payment_mode,
            "rating": self.rating,
            "rating_count": self.rating_count,
            "product_url": self.product_url,
            "mb_score": self.mb_score,
            "cb_score": self.cb_score,
            "created_at": self.created_at.isoformat(),
            "expires_at": self.expires_at.isoformat() if self.expires_at else None
        }

    def __repr__(self):
        return f"<Product {self.product_name} - {self.platform}>"


class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    external_product_id = db.Column(db.String(255))
    product_name = db.Column(db.String(255))
    platform = db.Column(db.String(50))
    author_name = db.Column(db.String(100))
    rating = db.Column(db.Float)
    content = db.Column(db.Text)
    source = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "external_product_id": self.external_product_id,
            "product_name": self.product_name,
            "platform": self.platform,
            "author_name": self.author_name,
            "rating": self.rating,
            "content": self.content,
            "source": self.source,
            "created_at": self.created_at.isoformat()
        }

    def __repr__(self):
        return f"<Review {self.product_name} by {self.author_name}>"


class FavoriteProduct(db.Model):
    __tablename__ = 'favorite_products'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    external_product_id = db.Column(db.String(255), primary_key=True)
    product_name = db.Column(db.String(255))
    platform = db.Column(db.String(50))
    price = db.Column(db.Numeric(10, 2))
    saved_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "external_product_id": self.external_product_id,
            "product_name": self.product_name,
            "platform": self.platform,
            "price": float(self.price),
            "saved_at": self.saved_at.isoformat()
        }

    def __repr__(self):
        return f"<FavoriteProduct {self.product_name} by User {self.user_id}>"
