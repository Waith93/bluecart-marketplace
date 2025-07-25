from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from app.routes.productSearch import router as search_router
from app.routes.reviews import router as reviews_router
from app.routes.auth import router as auth_router
from app.routes.favourites import router as favourites_router
from app.routes.searchHistory import router as searchhistory_router
from app.routes.productdetails import router as productdetails_router
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello, welcome to BlueCart API"}

app.include_router(search_router, prefix="/search", tags=["Search"])
app.include_router(reviews_router, prefix="/reviews", tags=["Reviews"])
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(favourites_router, prefix="/favorites", tags=["Favorites"])
app.include_router(searchhistory_router, prefix="/search-history", tags=["SearchHistory"])
app.include_router(productdetails_router, prefix="/products", tags=["ProductDetails"])
