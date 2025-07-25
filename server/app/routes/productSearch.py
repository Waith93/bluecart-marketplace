from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
import requests
from app import models
from app.database import get_db
import os


router = APIRouter(tags=["Search"])

@router.get("/", response_model=dict)

def search_products(
    query: str = Query(..., description="Search query (e.g., 'laptop')"),
    platform: str = Query(..., enum=["amazon", "ebay", "shopify", "walmart", "alibaba"], description="Platform to search"),
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
            params = {
                "q": query,
                "limit": "5",  
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

        elif platform == "alibaba":
            # Direct Alibaba API URL and API Key provided directly here
            url = "https://alibaba-datahub.p.rapidapi.com/item_search"
            headers = {
                "x-rapidapi-host": "alibaba-datahub.p.rapidapi.com",
                "x-rapidapi-key": "5b448cc458mshd5487c3db1ed748p1cb6afjsnb1ac04f810b8"
            }
            params = {
                "q": query,  
                "page": "1",  
            }

        else:
            raise HTTPException(status_code=400, detail="Unsupported platform.")

        response = requests.get(url, headers=headers, params=params)

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"API request failed: {response.text}"
            )

        data = response.json()

        if platform == "alibaba":
            products = data.get("resultList", [])
            
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
                    image_url=item.get("image") or None,
                    specs=item  
                )
                db.add(new_product)
                
        else:
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
                    specs=item 
                )
                db.add(new_product)
        
        db.commit()
        return data

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"API request error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
