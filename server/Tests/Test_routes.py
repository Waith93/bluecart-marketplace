import pytest
from httpx import AsyncClient
from sqlmodel import SQLModel, create_engine
from fastapi.testclient import TestClient

from app.main import app
from app.db import get_session
from app.models import User, SearchHistory, Product, FavoriteProduct, Review
from sqlmodel import Session

# Create a test SQLite DB
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Override the DB dependency
def override_get_session():
    with Session(engine) as session:
        yield session

app.dependency_overrides[get_session] = override_get_session

@pytest.fixture(scope="module")
def prepare_database():
    SQLModel.metadata.create_all(engine)
    yield
    SQLModel.metadata.drop_all(engine)

@pytest.mark.anyio
async def test_signup_login_routes(prepare_database):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        res = await ac.post("/signup", json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123"
        })
        assert res.status_code == 201

        res = await ac.post("/login", json={
            "email": "test@example.com",
            "password": "password123"
        })
        assert res.status_code == 200
        assert "access_token" in res.json()
        token = res.json()["access_token"]
        return token

@pytest.mark.anyio
async def test_search_products_reviews_favorites(prepare_database):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Sign up + Login
        await ac.post("/signup", json={
            "username": "testsearch",
            "email": "search@example.com",
            "password": "pass123"
        })
        res = await ac.post("/login", json={
            "email": "search@example.com",
            "password": "pass123"
        })
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Search
        res = await ac.post("/search", json={"query": "laptop"}, headers=headers)
        assert res.status_code == 200 or res.status_code == 202

        # Add Product
        res = await ac.post("/products", json={
            "external_product_id": "abc123",
            "product_name": "Laptop XYZ",
            "platform": "Amazon",
            "price": 1000.0,
            "delivery_cost": 100.0,
            "payment_mode": "Credit Card",
            "rating": 4.5,
            "rating_count": 200,
            "product_url": "http://amazon.com/laptopxyz",
            "mb_score": 0.9,
            "cb_score": 0.8,
        }, headers=headers)
        assert res.status_code == 201

        # Get Products
        res = await ac.get("/products", headers=headers)
        assert res.status_code == 200
        assert isinstance(res.json(), list)

        # Add Favorite
        res = await ac.post("/favorites", json={
            "external_product_id": "abc123",
            "product_name": "Laptop XYZ",
            "platform": "Amazon",
            "price": 1000.0
        }, headers=headers)
        assert res.status_code == 201

        # Get Favorites
        res = await ac.get("/favorites", headers=headers)
        assert res.status_code == 200
        assert isinstance(res.json(), list)

        # Get Reviews
        res = await ac.get("/reviews", params={"product_id": "abc123"})
        assert res.status_code == 200
        assert isinstance(res.json(), list)
