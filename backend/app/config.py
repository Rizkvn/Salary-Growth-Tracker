from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_password: str
    jwt_secret: str
    access_token_expire_minutes: int = 60
    database_url: str = "sqlite:///./salary_tracker.db"

    class Config:
        env_file = ".env"

settings = Settings()
