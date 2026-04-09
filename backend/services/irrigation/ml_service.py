import os
import json
from pathlib import Path

class MLService:
    def __init__(self):
        import joblib
        import pandas as pd

        self._pd = pd

        # Prefer env override, otherwise resolve repo root relative to this file.
        base_dir = os.getenv("HAL_BASE_DIR")
        if base_dir:
            base_path = Path(base_dir)
        else:
            base_path = Path(__file__).resolve().parents[3]

        self.base_dir = str(base_path)
        self.models_dir = str(base_path / "models" / "irrigation")
        
        # Load the models
        clf_path = os.path.join(self.models_dir, "classifier.pkl")
        reg_path = os.path.join(self.models_dir, "regressor.pkl")
        features_path = os.path.join(self.models_dir, "feature_names.json")
        
        if not all([os.path.exists(clf_path), os.path.exists(reg_path), os.path.exists(features_path)]):
            raise FileNotFoundError(f"Models not found in {self.models_dir}. Please run the training script.")
            
        self.classifier = joblib.load(clf_path)
        self.regressor = joblib.load(reg_path)
        
        with open(features_path, "r") as f:
            self.feature_names = json.load(f)

    def predict(self, input_data: dict):
        df = self._pd.DataFrame([input_data])
        df = df[self.feature_names] # Ensure order
        
        irrigate_needed = bool(self.classifier.predict(df)[0])
        amount_mm = float(self.regressor.predict(df)[0]) if irrigate_needed else 0.0
        
        return {
            "irrigate": irrigate_needed,
            "amount_mm": round(max(0, amount_mm), 2)
        }

# Singleton instance
ml_service = None

def get_ml_service():
    global ml_service
    if ml_service is None:
        ml_service = MLService()
    return ml_service
