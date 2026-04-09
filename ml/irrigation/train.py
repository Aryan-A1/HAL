import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OrdinalEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor

# Adjusted Paths for HAL Structure
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data/irrigation_prediction/raw/irrigation_prediction.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models/irrigation")
os.makedirs(MODELS_DIR, exist_ok=True)

def train():
    if not os.path.exists(DATA_PATH):
        print(f"Error: {DATA_PATH} not found. Please place your csv file in 'data/irrigation_prediction/raw'.")
        return

    print("📊 Loading data...")
    df = pd.read_csv(DATA_PATH)

    # Columns based on your dataset
    CATEGORICAL_COLS = ["Soil_Type", "Crop_Type", "Crop_Growth_Stage", "Season", "Irrigation_Type", "Water_Source", "Mulching_Used", "Region"]
    NUMERICAL_COLS = ["Soil_pH", "Soil_Moisture", "Organic_Carbon", "Electrical_Conductivity", "Temperature_C", "Humidity", "Rainfall_mm", "Sunlight_Hours", "Wind_Speed_kmh", "Field_Area_hectare", "Previous_Irrigation_mm"]
    
    # Map Irrigation_Need to binary: Low -> 0, Medium/High -> 1
    print("🧹 Preprocessing target labels...")
    target_map = {"Low": 0, "Medium": 1, "High": 1}
    df["Irrigation_Need_Binary"] = df["Irrigation_Need"].map(target_map)
    
    X = df.drop(columns=["Irrigation_Need", "Irrigation_Need_Binary"])
    y_class = df["Irrigation_Need_Binary"]

    # Preprocessor
    preprocessor = ColumnTransformer([
        ("num", Pipeline([("imputer", SimpleImputer(strategy="median")), ("scaler", StandardScaler())]), NUMERICAL_COLS),
        ("cat", Pipeline([("imputer", SimpleImputer(strategy="most_frequent")), ("encoder", OrdinalEncoder(handle_unknown="use_encoded_value", unknown_value=-1))]), CATEGORICAL_COLS)
    ])

    print("🚀 Training Classifier (RandomForest: Irrigate or Not)...")
    clf = Pipeline([("preprocessor", preprocessor), ("classifier", RandomForestClassifier(n_estimators=100, random_state=42))])
    clf.fit(X, y_class)
    
    print("🚀 Training Regressor (Amount in mm)...")
    # Amount needed (training on rows where irrigation was needed)
    reg_df = df[df["Irrigation_Need_Binary"] == 1]
    reg = Pipeline([("preprocessor", preprocessor), ("regressor", RandomForestRegressor(n_estimators=100, random_state=42))])
    reg.fit(reg_df.drop(columns=["Irrigation_Need", "Irrigation_Need_Binary"]), reg_df["Previous_Irrigation_mm"])

    # Store
    joblib.dump(clf, os.path.join(MODELS_DIR, "classifier.pkl"))
    joblib.dump(reg, os.path.join(MODELS_DIR, "regressor.pkl"))
    
    # Save feature names for consistency at inference
    import json
    with open(os.path.join(MODELS_DIR, "feature_names.json"), "w") as f:
        json.dump(list(X.columns), f)
        
    print(f"✅ Models and feature names saved in {MODELS_DIR}")

if __name__ == "__main__":
    train()
