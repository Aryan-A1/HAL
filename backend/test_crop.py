import os
import sys
from fastapi.testclient import TestClient
from datetime import date

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app

client = TestClient(app)

def test_crop_flow():
    print("--- Starting Crop Profile Verification ---")
    
    # 1. Signup a test user first (to get a user in the system)
    test_user = {
        "email": "crop_tester@example.com",
        "password": "testpassword123",
        "full_name": "Crop Tester",
        "phone_number": "+1112223333",
        "country": "India",
        "state": "Punjab",
        "city": "Ludhiana"
    }
    client.post("/api/auth/signup", json=test_user)
    
    # 2. Create a crop profile
    # Note: Using user_id=1 placeholder as set in the router for now
    crop_data = {
        "crop_name": "Wheat",
        "soil_type": "Alluvial",
        "sowing_date": str(date(2023, 11, 15)),
        "expected_harvesting_date": str(date(2024, 4, 15))
    }
    
    print(f"Creating crop profile for {crop_data['crop_name']}...")
    response = client.post("/api/crops/", json=crop_data)
    
    if response.status_code == 200:
        data = response.json()
        print("[OK] Crop Profile Created Successfully!")
        print(f"   Auto-fetched Crop Type: {data['crop_type']}")
        print(f"   Crop Name (validated): {data['crop_name']}")
    else:
        print(f"[ERROR] Failed to create crop profile: {response.status_code}")
        print(response.json())
        return

    # 3. List crop profiles
    print("\nFetching user crop profiles...")
    list_response = client.get("/api/crops/")
    if list_response.status_code == 200:
        crops = list_response.json()
        print(f"[OK] Found {len(crops)} crop profile(s).")
        for c in crops:
            print(f"   - {c['crop_name']} ({c['crop_type']}) | Sown: {c['sowing_date']}")
    else:
        print(f"[ERROR] Failed to fetch crop profiles: {list_response.status_code}")

    print("\n--- Crop Profile Verification Complete ---")

if __name__ == "__main__":
    test_crop_flow()
