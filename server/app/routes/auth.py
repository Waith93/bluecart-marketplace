from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from datetime import datetime, timedelta
import jwt
from bson import ObjectId

auth_bp = Blueprint('auth', __name__)


client = MongoClient('mongodb://localhost:27017')
db = client['bluecart']
users_collection = db['users']

JWT_SECRET = 'BCM9878'  

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """
    Register a new user.
    Expects: { "email": str, "password": str, "name": str }
    Returns: { "message": str, "userId": str }
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password or not name:
        return jsonify({'message': 'Email, password, and name are required'}), 400


    if users_collection.find_one({'email': email}):
        return jsonify({'message': 'User already exists'}), 409

    hashed_password = generate_password_hash(password)
    user = {
        'email': email,
        'password': hashed_password,
        'name': name,
        'created_at': datetime.utcnow()
    }
    result = users_collection.insert_one(user)
    
    return jsonify({
        'message': 'User created successfully',
        'userId': str(result.inserted_id)
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Log in a user and return a JWT token.
    Expects: { "email": str, "password": str }
    Returns: { "token": str, "userId": str }
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    user = users_collection.find_one({'email': email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid credentials'}), 401


    token = jwt.encode({
        'userId': str(user['_id']),
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, JWT_SECRET, algorithm='HS256')

    return jsonify({
        'token': token,
        'userId': str(user['_id'])
    }), 200