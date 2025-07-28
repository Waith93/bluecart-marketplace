from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
import requests
import httpx
from app import models
from app.database import get_db
import os
from typing import List
import asyncio


router = APIRouter(tags=["Search"])

async def fetch_fake_target_api(search_term: str) -> List[dict]:
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get("https://fakestoreapi.com/products")
            if response.status_code == 200:
                products = response.json()
                filtered_products = [
                    {
                        "id": str(product["id"]),
                        "title": product["title"],
                        "price": product["price"],
                        "description": product["description"],
                        "image": product["image"],
                        "category": product["category"],
                        "rating": product.get("rating", {}).get("rate", 0),
                        "source_api": "target",
                        "url": f"https://fakestoreapi.com/products/{product['id']}",
                        "reviews": product.get("reviews", 0)

                    }
                    for product in products
                    if search_term.lower() in product["title"].lower() or
                       search_term.lower() in product["category"].lower()
                ]
                return filtered_products[:10] 
            else:
                print(f"Target API returned status: {response.status_code}")
                return []
    except Exception as e:
        print(f"Error fetching from Target API: {e}")
        return []

async def fetch_dummyjson_api(search_term: str) -> List[dict]:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"https://dummyjson.com/products/search?q={search_term}&limit=10")
            if response.status_code == 200:
                data = response.json()
                products = [
                    {
                        "id": str(product["id"]),
                        "title": product["title"],
                        "price": product["price"],
                        "description": product["description"],
                        "image": product.get("thumbnail", ""),
                        "category": product.get("category", ""),
                        "rating": product.get("rating", 0),
                        "source_api": "ebay",
                        "url": f"https://dummyjson.com/products/{product['id']}"
                    }
                    for product in data.get("products", [])
                ]
                return products
    except Exception as e:
        print(f"Error fetching from eBay API: {e}")
    return []

@router.get("/", response_model=dict)
async def search_products(
    query: str = Query(..., description="Search query (e.g., 'laptop')"),
    platform: str = Query(..., enum=["amazon", "ebay", "alibaba", "target"], description="Platform to search"),  # Change this line
    db: Session = Depends(get_db)
):
    try:
        print(f"Searching for '{query}' on platform '{platform}'")

        if platform == "target":
            print("Fetching from Target API...")
            data = await fetch_fake_target_api(query)

            print(f"Found {len(data)} products from Target API")

            for item in data:
                product_id = f"fake_store_{item.get('id')}"  
                
                try:
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
                except Exception as db_error:
                    print(f"Database error for product {product_id}: {db_error}")
                    continue
            
            try:
                db.commit()
                print("Successfully saved products to database")
            except Exception as commit_error:
                print(f"Database commit error: {commit_error}")
                db.rollback()
            
            return {
                "products": data,
                "total_count": len(data),
                "platform": platform,
                "query": query
            }

        elif platform == "amazon":
            url = f"{os.getenv('RAPIDAPI_AMAZON_BASE_URL')}/search"
            headers = {
                "x-rapidapi-host": os.getenv("RAPIDAPI_AMAZON_HOST"),
                "x-rapidapi-key": os.getenv("RAPIDAPI_AMAZON_KEY")
            }
            params = {"query": query}

       
        elif platform == "ebay":
            print("Fetching from eBay API...")
            data = await fetch_dummyjson_api(query)
            
            print(f"Found {len(data)} products from eBay API")
            
            for item in data:
                product_id = f"ebay_{item.get('id')}"  
                
                try:
                    existing = db.query(models.Product).filter_by(id=product_id).first()
                    if existing:
                        continue

                    new_product = models.Product(
                        id=product_id,
                        product_name=item.get("title") or "Unnamed",
                        platform=platform,
                        image_url=item.get("image") or None,
                        specs=item,
                       reviews=item.get("reviews", 0)

                    )
                    db.add(new_product)
                except Exception as db_error:
                    print(f"Database error for product {product_id}: {db_error}")
                    continue
            
            try:
                db.commit()
                print("Successfully saved products to database")
            except Exception as commit_error:
                print(f"Database commit error: {commit_error}")
                db.rollback()
            
            return {
                "products": data,
                "total_count": len(data),
                "platform": platform,
                "query": query
            }
        

        elif platform == "alibaba":
            url = "https://alibaba-datahub.p.rapidapi.com/item_search"
            headers = {
                "x-rapidapi-host": "alibaba-datahub.p.rapidapi.com",
                "x-rapidapi-key": "ffe1e88834msh41af6c29c1ac06dp1ee8b9jsn2c659a15ac1d"
            }
            params = {
                "q": query,  
                "page": "1",  
            }

        else:
            raise HTTPException(status_code=400, detail="Unsupported platform.")

        print(f"Making request to {url} with params {params}")
        response = requests.get(url, headers=headers, params=params, timeout=30)

        if response.status_code != 200:
            print(f"API request failed with status {response.status_code}: {response.text}")
            raise HTTPException(
                status_code=response.status_code,
                detail=f"API request failed: {response.text}"
            )

        data = response.json()
        print(f"Received data from {platform}: {len(str(data))} characters")

        if platform == "alibaba":
            products = data.get("resultList", [])
            
            for item in products:
                product_id = item.get("itemId")
                if not product_id:
                    continue
                    
                try:
                    existing = db.query(models.Product).filter_by(id=product_id).first()
                    if existing:
                        continue

                    new_product = models.Product(
                        id=product_id,
                        product_name=item.get("title") or "Unnamed",
                        platform=platform,
                        image_url=item.get("image") or None,
                        specs=item,
                         
                    )
                    db.add(new_product)
                except Exception as db_error:
                    print(f"Database error for product {product_id}: {db_error}")
                    continue
                
        else:
            products = data.get("productSummaries") or []
            for item in products:
                product_id = item.get("itemId")
                if not product_id:
                    continue
                    
                try:
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
                except Exception as db_error:
                    print(f"Database error for product {product_id}: {db_error}")
                    continue
        
        try:
            db.commit()
            print("Successfully saved products to database")
        except Exception as commit_error:
            print(f"Database commit error: {commit_error}")
            db.rollback()
        
        return data

    except HTTPException:
        raise
    except requests.exceptions.RequestException as e:
        print(f"Request exception: {e}")
        raise HTTPException(status_code=500, detail=f"API request error: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")