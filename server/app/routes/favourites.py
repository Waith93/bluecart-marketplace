from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
import jwt

favourites_bp = Blueprint('favourites', __name__)

client = MongoClient('mongodb://localhost:27017')
db = client['bluecart']
favourites_collection = db['favourites']
products_collection = db['products']


JWT_SECRET = 'BCM9878'  

def verify_token():
    """
    Verify JWT token from Authorization header.
    Returns: userId (str) or raises an error.
    """
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None, jsonify({'message': 'Missing or invalid token'}), 401
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload['userId'], None
    except jwt.ExpiredSignatureError:
        return None, jsonify({'message': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return None, jsonify({'message': 'Invalid token'}), 401

@favourites_bp.route('/favourites/<userId>', methods=['GET'])
def get_favourites(userId):
    """
    Get a user's favorite products.
    Returns: Array of product objects.
    """
    user_id, error = verify_token()
    if error:
        return error
    if user_id != userId:
        return jsonify({'message': 'Unauthorized'}), 403

    favourites = favourites_collection.find_one({'userId': userId})
    if not favourites:
        return jsonify([]), 200

    
    product_ids = [ObjectId(pid) for pid in favourites.get('productIds', [])]
    products = list(products_collection.find({'_id': {'$in': product_ids}}))
    products = [{'_id': str(p['_id']), 'name': p['name'], 'price': p['price'], 'image': p.get('image')} for p in products]
    
    return jsonify(products), 200

@favourites_bp.route('/favourites', methods=['POST'])
def add_favourite():
    """
    Add a product to a user's favorites.
    Expects: { "userId": str, "productId": str }
    Returns: Product object.
    """
    user_id, error = verify_token()
    if error:
        return error

    data = request.get_json()
    userId = data.get('userId')
    productId = data.get('productId')

    if user_id != userId:
        return jsonify({'message': 'Unauthorized'}), 403
    if not userId or not productId:
        return jsonify({'message': 'userId and productId are required'}), 400

    
    product = products_collection.find_one({'_id': ObjectId(productId)})
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    
    favourites = favourites_collection.find_one({'userId': userId})
    if favourites:
        if productId in favourites.get('productIds', []):
            return jsonify({'message': 'Product already in favourites'}), 400
        favourites_collection.update_one(
            {'userId': userId},
            {'$push': {'productIds': productId}}
        )
    else:
        favourites_collection.insert_one({
            'userId': userId,
            'productIds': [productId]
        })

    return jsonify({
        '_id': str(product['_id']),
        'name': product['name'],
        'price': product['price'],
        'image': product.get('image')
    }), 201

@favourites_bp.route('/favourites/<userId>/<productId>', methods=['DELETE'])
def remove_favourite(userId, productId):
    """
    Remove a product from a user's favorites.
    Returns: { "message": str }
    """
    user_id, error = verify_token()
    if error:
        return error
    if user_id != userId:
        return jsonify({'message': 'Unauthorized'}), 403

    favourites = favourites_collection.find_one({'userId': userId})
    if not favourites or productId not in favourites.get('productIds', []):
        return jsonify({'message': 'Product not in favourites'}), 404

    favourites_collection.update_one(
        {'userId': userId},
        {'$pull': {'productIds': productId}}
    )
    
    return jsonify({'message': 'Product removed from favourites'}), 200