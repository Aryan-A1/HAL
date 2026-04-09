from fastapi.testclient import TestClient
import sys
sys.path.append('.')
from backend.main import app

client = TestClient(app)
res_all = client.get("/api/schemes/all")
print("GET /api/schemes/all - STATUS:", res_all.status_code)
print("Returned", len(res_all.json()), "schemes.")
if res_all.status_code == 200 and len(res_all.json()) > 0:
    print("Example Scheme:", res_all.json()[0].get('name'))

res_filter = client.get("/api/schemes?crop=wheat")
print("\nGET /api/schemes?crop=wheat - STATUS:", res_filter.status_code)
print("Returned", len(res_filter.json()), "schemes matching 'wheat'.")
