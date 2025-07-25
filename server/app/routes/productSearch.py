from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
import requests
import os
from dotenv import load_dotenv
from app import models
from app.database import get_db

load_dotenv()

router = APIRouter(tags=["Search"])  # Added tags to match main.py

@router.get("/", response_model=dict)
def search_products(
    query: str = Query(..., description="Search query (e.g., 'laptop')"),
    platform: str = Query(..., enum=["amazon", "ebay", "shopify", "walmart"], description="Platform to search"),
    db: Session = Depends(get_db)
):
    try:
        if platform == "amazon":
            url = f"{os.getenv('RAPIDAPI_AMAZON_BASE_URL')}/search"
            headers = {
                "x-rapidapi-host": os.getenv("RAPIDAPI_AMAZON_HOST"),
                "x-rapidapi-key": os.getenv("RAPIDAPI_AMAZON_KEY")
            }
            params = {"query": query}

        elif platform == "ebay":
            # eBay API URL for product search
            url = f"https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search"
            headers = {
                "Authorization": f"Bearer {os.getenv('EBAY_APP_ID')}",
                "Content-Type": "application/json"
            }
            # Adding eBay-specific parameters
            params = {
                "q": query,
                "limit": "5",  # You can adjust the limit for number of results
            }

        elif platform == "shopify":
            url = f"{os.getenv('RAPIDAPI_SHOPIFY_BASE_URL')}/product/collections"
            headers = {
                "x-rapidapi-host": os.getenv("RAPIDAPI_SHOPIFY_HOST"),
                "x-rapidapi-key": os.getenv("RAPIDAPI_SHOPIFY_KEY")
            }
            params = {"url": f"https://{query}.myshopify.com"}

        elif platform == "walmart":
            url = f"{os.getenv('RAPIDAPI_WALMART_BASE_URL')}/walmart-search"
            headers = {
                "x-rapidapi-host": os.getenv("RAPIDAPI_WALMART_HOST"),
                "x-rapidapi-key": os.getenv("RAPIDAPI_WALMART_KEY")
            }
            params = {
                "keyword": query,
                "page": "1",
                "sortBy": "best_match"
            }

        else:
            raise HTTPException(status_code=400, detail="Unsupported platform.")

        # Perform the API request
        response = requests.get(url, headers=headers, params=params)

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"API request failed: {response.text}"
            )

        data = response.json()

        # Save each product to DB if it doesn't exist
        products = data.get("productSummaries") or []
        for item in products:
            product_id = item.get("itemId")
            if not product_id:
                continue
            existing = db.query(models.Product).filter_by(id=product_id).first()
            if existing:
                continue

            new_product = models.Product(
                id=product_id,
                product_name=item.get("title") or "Unnamed",
                platform=platform,
                image_url=item.get("image.imageUrl") or None,
                specs=item  # Save the entire item for detailed info
            )
            db.add(new_product)
            db.commit()

        return data

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"API request error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
