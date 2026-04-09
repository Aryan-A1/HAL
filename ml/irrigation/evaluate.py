import pandas as pd
import numpy as np
import joblib
import os
import json
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, mean_absolute_error, r2_score

def evaluate():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    data_path = os.path.join(base_dir, "data/irrigation_prediction/raw/irrigation_prediction.csv")
    models_dir = os.path.join(base_dir, "models/irrigation")
    
    if not os.path.exists(data_path):
        print(f"❌ Data not found at {data_path}")
        return

    print("📊 Loading and preparing data...")
    df = pd.read_csv(data_path)
    
    # Preprocessing target labels (consistent with train.py)
    target_map = {"Low": 0, "Medium": 1, "High": 1}
    df["Irrigation_Need_Binary"] = df["Irrigation_Need"].map(target_map)
    
    X = df.drop(columns=["Irrigation_Need", "Irrigation_Need_Binary"])
    y_class = df["Irrigation_Need_Binary"]
    y_reg = df["Previous_Irrigation_mm"]
    
    # Load Models
    print("📂 Loading trained models from " + models_dir)
    try:
        clf = joblib.load(os.path.join(models_dir, "classifier.pkl"))
        reg = joblib.load(os.path.join(models_dir, "regressor.pkl"))
    except Exception as e:
        print(f"❌ Failed to load models: {e}")
        return

    X_train, X_test, y_class_train, y_class_test = train_test_split(X, y_class, test_size=0.2, random_state=42)
    _, _, y_reg_train, y_reg_test = train_test_split(X, y_reg, test_size=0.2, random_state=42)

    print("\n" + "="*30)
    print("🛡️  CLASSIFIER PERFORMANCE")
    print("="*30)
    y_class_pred = clf.predict(X_test)
    print(f"Accuracy: {accuracy_score(y_class_test, y_class_pred):.2%}")
    print("\nClassification Report:")
    print(classification_report(y_class_test, y_class_pred, target_names=["No Irrigation", "Irrigation Needed"]))

    print("\n" + "="*30)
    print("📏  REGRESSOR PERFORMANCE")
    print("="*30)
    mask = y_class_test == 1
    if mask.any():
        y_reg_pred = reg.predict(X_test[mask])
        mae = mean_absolute_error(y_reg_test[mask], y_reg_pred)
        r2 = r2_score(y_reg_test[mask], y_reg_pred)
        print(f"Mean Absolute Error: {mae:.2f} mm")
        print(f"R² Score: {r2:.4f}")
    else:
        print("No irrigation events in the test set.")

if __name__ == "__main__":
    evaluate()
