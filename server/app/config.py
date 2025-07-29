from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str

    SECRET_KEY: str 

    RAPIDAPI_AMAZON_KEY: str = ""
    RAPIDAPI_AMAZON_HOST: str = ""
    RAPIDAPI_AMAZON_BASE_URL: str = ""
    
    

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
