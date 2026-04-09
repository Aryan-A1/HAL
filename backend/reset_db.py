import sys
import os

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import engine, Base
from backend.models.user import User
from backend.models.crop import CropProfile

def reset_database():
    print("--- ⚠️ Resetting Database for Simplified User Table ⚠️ ---")
    
    try:
        # Drop all tables to refresh schema
        print("Dropping all tables...")
        Base.metadata.drop_all(bind=engine)
        print("✅ Tables dropped successfully.")
        
        # Recreate tables based on current models
        print("Recreating tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Database schema updated to simplified version.")
        
    except Exception as e:
        print(f"❌ Error during database reset: {e}")
        print("\nPlease ensure your DATABASE_URL in .env is correct and reachable.")

if __name__ == "__main__":
    reset_database()
