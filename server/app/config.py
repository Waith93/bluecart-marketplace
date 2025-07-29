from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    RAPIDAPI_AMAZON_KEY: str = ""
    RAPIDAPI_AMAZON_HOST: str = ""
    RAPIDAPI_AMAZON_BASE_URL: str = ""

    model_config = SettingsConfigDict(env_file="server/.env", extra="ignore")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        print("SECRET_KEY:", os.getenv("SECRET_KEY"))
        print("DATABASE_URL:", os.getenv("DATABASE_URL"))
        print("RAPIDAPI_AMAZON_KEY:", os.getenv("RAPIDAPI_AMAZON_KEY"))

settings = Settings()

