import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
from pathlib import Path
from sklearn.preprocessing import LabelEncoder

# Routes
DATASET_PATH = Path("../dataset/sensor_data.csv")
MODEL_PATH = Path("model.joblib")

def train_model():
    # 1. Load dataset
    data = pd.read_csv(DATASET_PATH)
    
    # 2. Caracteristics of failure risk
    data["failure_risk"] = (
        ((data["temperature"] > 95) & (data["vibration"] > 0.7)) |  # Condition 1
        (data["oil_level"] < 60) |                                  # Condition 2
        (data["error_code"] != "NONE")                              # Condition 3
    ).astype(int)
    
    # 3. Coding categorical variables
    le = LabelEncoder()
    data["error_code"] = le.fit_transform(data["error_code"])
    data["machine_name"] = le.fit_transform(data["machine_name"])
    data["location"] = le.fit_transform(data["location"])
    
    # 4. Calculate days since last maintenance
    data["last_maintenance"] = pd.to_datetime(data["last_maintenance"])
    data["days_since_maintenance"] = (pd.Timestamp.now() - data["last_maintenance"]).dt.days
    
    # 5. Select features
    features = [
        "running_hours", "temperature", "vibration", "pressure", 
        "oil_level", "error_code", "days_since_maintenance"
    ]
    X = data[features]
    y = data["failure_risk"]
    
    # 6. Train model
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight="balanced")
    model.fit(X, y)
    
    # 7. Save model
    joblib.dump(model, MODEL_PATH)
    print(f"Model trained and saved in {MODEL_PATH}")

if __name__ == "__main__":
    train_model()