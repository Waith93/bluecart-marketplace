from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import requests
import os
import json
from dotenv import load_dotenv
from app.database import get_db
from app import models 
from typing import Dict, Any, Optional 

router = APIRouter(tags=["Product Details"])

@router.get("/{product_id}", response_model=Dict[str, Any])
def get_product_detail(
    product_id: str,
    platform: str = Query(..., enum=["amazon", "ebay", "shopify", "walmart", "aliexpress"]),
    db: Session = Depends(get_db)
):
    try:
        url, headers, params = None, {}, {}

        if platform == "amazon":
            url = f"{os.getenv('RAPIDAPI_AMAZON_BASE_URL')}/product-details"
            headers = {
                "X-RapidAPI-Key": os.getenv("RAPIDAPI_AMAZON_KEY"),
                "X-RapidAPI-Host": os.getenv("RAPIDAPI_AMAZON_HOST")
            }
            params = {"asin": product_id}

        elif platform == "ebay":
            url = f"{os.getenv('RAPIDAPI_EBAY_BASE_URL')}/item"
            headers = {
                "X-RapidAPI-Key": os.getenv("RAPIDAPI_EBAY_KEY"),
                "X-RapidAPI-Host": os.getenv("RAPIDAPI_EBAY_HOST")
            }
            params = {"item_id": product_id}

        elif platform == "shopify":
            url = f"{os.getenv('RAPIDAPI_SHOPIFY_BASE_URL')}/product"
            headers = {
                "X-RapidAPI-Key": os.getenv("RAPIDAPI_SHOPIFY_KEY"),
                "X-RapidAPI-Host": os.getenv("RAPIDAPI_SHOPIFY_HOST")
            }
            params = {
                "product_id": product_id,
                "store_url": os.getenv("RAPIDAPI_SHOPIFY_STORE_URL")
            }

        elif platform == "walmart":
            url = f"{os.getenv('RAPIDAPI_WALMART_BASE_URL')}/product"
            headers = {
                "X-RapidAPI-Key": os.getenv("RAPIDAPI_WALMART_KEY"),
                "X-RapidAPI-Host": os.getenv("RAPIDAPI_WALMART_HOST")
            }
            params = {"usItemId": product_id}

        elif platform == "aliexpress":
            url = f"{os.getenv('RAPIDAPI_ALIEXPRESS_BASE_URL')}/product"
            headers = {
                "X-RapidAPI-Key": os.getenv("RAPIDAPI_ALIEXPRESS_KEY"),
                "X-RapidAPI-Host": os.getenv("RAPIDAPI_ALIEXPRESS_HOST")
            }
            params = {"productId": product_id}

        response = requests.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        product_data = {}
        if platform == "amazon":
            # Handle Amazon's specific response structure
            amazon_data = data.get("data", {})
            product_data = {
                "id": amazon_data.get("asin", product_id),
                "name": amazon_data.get("product_title", "Unknown Product"),
                "price": float(amazon_data.get("product_price", 0)) if amazon_data.get("product_price") else 0,
                "description": "\n".join(amazon_data.get("about_product", [])) or "No description available",
                "images": amazon_data.get("product_photos", []),
                "specifications": amazon_data.get("product_details", {}),
                "rating": float(amazon_data.get("product_star_rating", 0)),
                "rating_count": amazon_data.get("product_num_ratings", 0),
                "availability": amazon_data.get("product_availability", "Unknown"),
                "url": amazon_data.get("product_url", "#")
            }
        elif platform == "ebay":
            product_data = {
                "id": data.get("itemId", product_id),
                "name": data.get("title", "Unknown Product"),
                "price": float(data.get("price", {}).get("value", 0)),
                "description": data.get("description", ""),
                "images": [img.get("imageUrl") for img in data.get("images", []) if img.get("imageUrl")],
                "specifications": data.get("itemSpecifics", {})
            }
        elif platform == "shopify":
            product_data = {
                "id": data.get("id", product_id),
                "name": data.get("title", "Unknown Product"),
                "price": float(data.get("price", 0)),
                "description": data.get("body_html", ""),
                "images": [img.get("src") for img in data.get("images", []) if img.get("src")],
                "specifications": data.get("options", [])
            }
        elif platform == "walmart":
            product_data = {
                "id": data.get("usItemId", product_id),
                "name": data.get("name", "Unknown Product"),
                "price": float(data.get("price", 0)),
                "description": data.get("shortDescription", ""),
                "images": data.get("imageInfo", {}).get("imageUrls", []),
                "specifications": data.get("specifications", [])
            }
        elif platform == "aliexpress":
            product_data = {
                "id": product_id,
                "name": data.get("product_title", "Unknown Product"),
                "price": float(data.get("app_sale_price", 0)) if data.get("app_sale_price") else 0,
                "description": data.get("product_description", "No description available"),
                "images": [data.get("image_url")] if data.get("image_url") else [],
                "specifications": {
                    "Store": data.get("store_name"),
                    "Sales": data.get("volume"),
                    "Original Price": data.get("original_price"),
                    "Discount": data.get("discount"),
                    **data.get("properties", {})
                },
                "rating": float(data.get("evaluate_rate", 0)) if data.get("evaluate_rate") else 0,
                "rating_count": data.get("evaluation_count", 0),
                "availability": "Available" if data.get("app_sale_price") else "Unknown",
                "url": data.get("product_url", "#")
            }

        if not product_data.get("name"):
            raise HTTPException(
                status_code=404,
                detail=f"Product details not found for {product_id} on {platform}"
            )

        return {
            "success": True,
            "platform": platform,
            "product": product_data,
            "retrieved_at": datetime.utcnow().isoformat()
        }

    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=502,
            detail=f"Error fetching from {platform} API: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )