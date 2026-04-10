from fastapi import APIRouter
from pydantic import BaseModel
import random

router = APIRouter(
    prefix="/nearby-stores",
    tags=["Stores"]
)

# Hardcoded pool of potential stores
MOCK_STORES = [
    {
        "name": "Kisan Agro Store",
        "address": "Near Market Road, Main Square",
        "rating": 4.3,
    },
    {
        "name": "Green Field Fertilizers",
        "address": "Main Highway, Industrial Area",
        "rating": 4.1,
    },
    {
        "name": "Agri Care Center",
        "address": "Village Chowk",
        "rating": 4.5,
    },
    {
        "name": "Bharat Seed & Chemicals",
        "address": "Railway Station Road",
        "rating": 3.9,
    },
    {
        "name": "Farmer's Choice Pesticides",
        "address": "Galla Mandi",
        "rating": 4.7,
    },
    {
        "name": "National Agri Traders",
        "address": "Opposite Panchayat Bhavan",
        "rating": 4.2,
    },
    {
        "name": "City Seed & Fertilizer",
        "address": "New Market, Shop No. 12",
        "rating": 4.0,
    },
    {
        "name": "Rural Crop Solutions",
        "address": "Bus Stand Complex",
        "rating": 4.6,
    }
]

@router.get("/")
def get_nearby_stores(lat: float, lng: float):
    """
    Returns a hardcoded list of nearby agricultural stores for demo purposes.
    Slightly randomizes the results to simulate a dynamic environment.
    """
    # Select a random subset of 3 to 6 stores to show
    num_stores = random.randint(3, 6)
    selected_stores = random.sample(MOCK_STORES, num_stores)
    
    response_data = []
    
    # Assign random distances and IDs
    for i, store in enumerate(selected_stores):
        # Generate random distance between 0.5 km and 8.0 km
        dist_km = round(random.uniform(0.5, 8.0), 1)
        
        # Determine "meters" string logic (800m instead of 0.8 km)
        if dist_km < 1.0:
            distance_str = f"{int(dist_km * 1000)} m"
        else:
            distance_str = f"{dist_km} km"
            
        # Optional: mock some coordinates vaguely near the provided lat/lng
        mock_lat = lat + random.uniform(-0.02, 0.02)
        mock_lng = lng + random.uniform(-0.02, 0.02)
            
        response_data.append({
            "id": f"store_{i}_{random.randint(1000, 9999)}",
            "name": store["name"],
            "address": store["address"],
            "rating": store["rating"],
            "distance_str": distance_str,
            "distance_value": dist_km,
            "lat": round(mock_lat, 6),
            "lng": round(mock_lng, 6)
        })
        
    # Sort by the numeric distance value
    response_data.sort(key=lambda x: x["distance_value"])
    
    return response_data
