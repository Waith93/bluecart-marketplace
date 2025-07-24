from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import requests
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(tags=["Search"])  # Added tags to match main.py

@router.get("/", response_model=dict)  # Changed to "/" and added response_model
def search_products(
    query: str = Query(..., description="Search query (e.g., 'laptop')"),
    platform: str = Query(..., enum=["amazon", "ebay", "shopify", "walmart"], description="Platform to search")
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
            url = f"{os.getenv('RAPIDAPI_EBAY_BASE_URL')}/search/{query}"
            headers = {
                "x-rapidapi-host": os.getenv("RAPIDAPI_EBAY_HOST"),
                "x-rapidapi-key": os.getenv("RAPIDAPI_EBAY_KEY")
            }
            params = {}

        elif platform == "shopify":
            url = f"{os.getenv('RAPIDAPI_SHOPIFY_BASE_URL')}/product/collections"
            headers = {
                "x-rapidapi-host": os.getenv("RAPIDAPI_SHOPIFY_HOST"),
                "x-rapidapi-key": os.getenv("RAPIDAPI_SHOPIFY_KEY")
            }
            params = {"url": f"https://{query}.myshopify.com"}

        elif platform == "walmart":
            url = "https://axesso-walmart-data-service.p.rapidapi.com/wlm/walmart-search-by-keyword"
            headers = {
                "X-RapidAPI-Key": os.getenv("RAPIDAPI_WALMART_KEY"),
                "X-RapidAPI-Host": "axesso-walmart-data-service.p.rapidapi.com"
            }
            params = {
                "keyword": query,
                "page": "1",
                "sortBy": "best_match"
            }

        else:
            raise HTTPException(status_code=400, detail="Unsupported platform.")

        response = requests.get(url, headers=headers, params=params)

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"API request failed: {response.text}"
            )

        return response.json()

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"API request error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")