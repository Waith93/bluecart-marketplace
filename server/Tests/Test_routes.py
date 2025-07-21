import json
import pytest
from app import app, db
from models import User, SearchHistory, Product, Review, FavoriteProduct, db

@pytest.fixture(scope='module')
def test_client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()


def register_user(client, username, email, password):
    return client.post('/signup', json={
        'username': username,
        'email': email,
        'password': password
    })


def login_user(client, email, password):
    return client.post('/login', json={
        'email': email,
        'password': password
    })


def test_user_registration_and_login(test_client):
    res = register_user(test_client, 'testuser', 'test@example.com', 'password123')
    assert res.status_code == 201

    res = login_user(test_client, 'test@example.com', 'password123')
    assert res.status_code == 200
    data = res.get_json()
    assert 'access_token' in data


def test_search_history_and_product_creation(test_client):
    register_user(test_client, 'searchuser', 'search@example.com', 'password123')
    login_res = login_user(test_client, 'search@example.com', 'password123')
    token = login_res.get_json()['access_token']

    # Simulate search creation
    search_data = {
        "query_text": "laptop"
    }
    res = test_client.post('/search', headers={'Authorization': f'Bearer {token}'}, json=search_data)
    assert res.status_code == 201
    search_id = res.get_json()['search_id']

    # Simulate product saving
    product_data = {
        "search_id": search_id,
        "external_product_id": "ext123",
        "product_name": "Lenovo Laptop",
        "platform": "amazon",
        "price": 800.50,
        "delivery_cost": 10.00,
        "payment_mode": "card",
        "rating": 4.2,
        "rating_count": 105,
        "product_url": "http://amazon.com/lenovo-laptop",
        "mb_score": 0.9,
        "cb_score": 0.8
    }
    res = test_client.post('/products', headers={'Authorization': f'Bearer {token}'}, json=product_data)
    assert res.status_code == 201


def test_favorite_product_flow(test_client):
    register_user(test_client, 'favuser', 'fav@example.com', 'password123')
    login_res = login_user(test_client, 'fav@example.com', 'password123')
    token = login_res.get_json()['access_token']

    # Add to favorites
    favorite_data = {
        "external_product_id": "extfav1",
        "product_name": "Samsung Galaxy S24",
        "platform": "ebay",
        "price": 699.99
    }
    res = test_client.post('/favorites', headers={'Authorization': f'Bearer {token}'}, json=favorite_data)
    assert res.status_code == 201

    # Get favorites
    res = test_client.get('/favorites', headers={'Authorization': f'Bearer {token}'})
    assert res.status_code == 200
    assert isinstance(res.get_json(), list)


def test_get_reviews(test_client):
    # Add review directly
    review = Review(
        external_product_id='extrev123',
        product_name='Sony Headphones',
        platform='alibaba',
        author_name='John Doe',
        rating=4.5,
        content='Great sound quality!',
        source='alibaba'
    )
    db.session.add(review)
    db.session.commit()

    res = test_client.get('/reviews?product_id=extrev123')
    assert res.status_code == 200
    reviews = res.get_json()
    assert isinstance(reviews, list)
    assert reviews[0]['product_name'] == 'Sony Headphones'

# These tests are for routes.py corresponding endpoints:

# POST /signup
# POST /login
# POST /search
# POST /products
# POST /favorites
# GET /favorites
# GET /reviews?product_id=...