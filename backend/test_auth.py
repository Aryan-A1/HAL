import os
import sys
from fastapi.testclient import TestClient

# Add project root to path to allow imports from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app

client = TestClient(app)

def test_auth_flow():
    print("--- Starting Auth Verification ---")
    
    # Setup test user data
    test_user = {
        "email": "tester@example.com",
        "password": "testpassword123",
        "full_name": "Test User",
        "phone_number": "+9876543210",
        "country": "India",
        "state": "Maharashtra",
        "city": "Mumbai"
    }

    # 1. Signup
    print(f"Testing Signup for {test_user['email']}...")
    signup_response = client.post("/api/auth/signup", json=test_user)
    
    if signup_response.status_code == 200:
        print("[OK] Signup Successful!")
    elif signup_response.status_code == 400 and "already exists" in signup_response.json().get("detail", ""):
        print("[INFO] User already exists, proceeding to login test.")
    else:
        print(f"[ERROR] Signup Failed: {signup_response.status_code}")
        print(signup_response.json())
        return

    # 2. Login with email
    print("\nTesting Login with EMAIL...")
    login_data_email = {
        "identifier": test_user["email"],
        "password": test_user["password"]
    }
    login_email_response = client.post("/api/auth/login", json=login_data_email)
    
    if login_email_response.status_code == 200:
        print("[OK] Login with Email Successful!")
        token = login_email_response.json().get("access_token")
        print(f"   Token generated: {token[:20]}...")
    else:
        print(f"[ERROR] Login with Email Failed: {login_email_response.status_code}")
        print(login_email_response.json())

    # 3. Login with phone
    print("\nTesting Login with PHONE...")
    login_data_phone = {
        "identifier": test_user["phone_number"],
        "password": test_user["password"]
    }
    login_phone_response = client.post("/api/auth/login", json=login_data_phone)
    
    if login_phone_response.status_code == 200:
        print("[OK] Login with Phone Successful!")
    else:
        print(f"[ERROR] Login with Phone Failed: {login_phone_response.status_code}")
        print(login_phone_response.json())

    # 4. Login with wrong password
    print("\nTesting Login with WRONG PASSWORD...")
    wrong_login_data = {
        "identifier": test_user["email"],
        "password": "wrongpassword"
    }
    wrong_response = client.post("/api/auth/login", json=wrong_login_data)
    if wrong_response.status_code == 401:
        print("[OK] Correctly rejected wrong password!")
    else:
        print(f"[ERROR] Failed to reject wrong password: {wrong_response.status_code}")

    print("\n--- Auth Verification Complete ---")

if __name__ == "__main__":
    test_auth_flow()
