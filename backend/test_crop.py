import os
import sys
from fastapi.testclient import TestClient
from datetime import date
import time

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app

client = TestClient(app)

def test_crop_flow():
    print("--- Starting Crop Profile Verification ---")
    
    # 1. Signup a test user and get token
    suffix = int(time.time())
    test_user = {
        "email": f"crop_tester_{suffix}@example.com",
        "password": "testpassword123",
        "full_name": "Crop Tester",
        "phone_number": f"+91{suffix % 10000000000:010d}",
        "country": "India",
        "state": "Punjab",
        "city": "Ludhiana"
    }
    signup_response = client.post("/api/auth/signup", json=test_user)
    if signup_response.status_code != 200:
        print(f"[ERROR] Signup failed: {signup_response.status_code}")
        print(signup_response.json())
        return

    token = signup_response.json().get("access_token")
    if not token:
        print("[ERROR] Signup response did not include token.")
        return

    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Create a crop profile
    crop_data = {
        "crop_name": "Wheat",
        "soil_type": "Alluvial",
        "sowing_date": str(date(2023, 11, 15)),
        "expected_harvesting_date": str(date(2024, 4, 15))
    }
    
    print(f"Creating crop profile for {crop_data['crop_name']}...")
    response = client.post("/api/crops", json=crop_data, headers=headers)
    
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
    list_response = client.get("/api/crops", headers=headers)
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
