from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str

    SECRET_KEY: str 

    RAPIDAPI_AMAZON_KEY: str = ""
    RAPIDAPI_AMAZON_HOST: str = ""
    RAPIDAPI_AMAZON_BASE_URL: str = ""
    
    RAPIDAPI_EBAY_KEY: str = ""
    RAPIDAPI_EBAY_HOST: str = ""
    RAPIDAPI_EBAY_BASE_URL: str = ""
    
    RAPIDAPI_ALIBABA_KEY: str = ""
    RAPIDAPI_ALIBABA_HOST: str = ""
    RAPIDAPI_ALIBABA_BASE_URL: str = ""

    RAPIDAPI_SHOPIFY_KEY: str = ""
    RAPIDAPI_SHOPIFY_HOST: str = ""
    RAPIDAPI_SHOPIFY_BASE_URL: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
