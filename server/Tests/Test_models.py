import sys
import os
import pytest
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Adjust the path so imports work
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app')))

from models import User, SearchHistory, Product, Review, FavoriteProduct

# Set up SQLAlchemy base and test database
Base = declarative_base()
TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(TEST_DATABASE_URL)
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_user_model(session):
    user = User(username="testuser", email="user@test.com", password_hash="hashedpwd")
    session.add(user)
    session.commit()
    session.refresh(user)
    assert user.id is not None
    assert user.username == "testuser"

def test_search_history_model(session):
    user = User(username="searcher", email="search@test.com", password_hash="pwd")
    session.add(user)
    session.commit()

    search = SearchHistory(user_id=user.id, query_text="test query")
    session.add(search)
    session.commit()
    session.refresh(search)
    assert search.id is not None
    assert search.query_text == "test query"

def test_product_model(session):
    user = User(username="produser", email="prod@test.com", password_hash="pwd")
    session.add(user)
    session.commit()

    search = SearchHistory(user_id=user.id, query_text="headphones")
    session.add(search)
    session.commit()

    product = Product(search_id=search.id, product_name="Sony Headphones", platform="Amazon", price=199.99)
    session.add(product)
    session.commit()
    session.refresh(product)
    assert product.id is not None
    assert product.product_name == "Sony Headphones"

def test_review_model(session):
    review = Review(product_name="MacBook", platform="Apple", author_name="Jane", rating=4.5, content="Great laptop!")
    session.add(review)
    session.commit()
    session.refresh(review)
    assert review.id is not None
    assert review.author_name == "Jane"

def test_favorite_product_model(session):
    user = User(username="favuser", email="fav@test.com", password_hash="pwd123")
    session.add(user)
    session.commit()

    fav = FavoriteProduct(user_id=user.id, external_product_id="XYZ123", product_name="Camera", platform="Ebay", price=299.99)
    session.add(fav)
    session.commit()
    session.refresh(fav)
    assert fav.external_product_id == "XYZ123"
    assert fav.product_name == "Camera"
