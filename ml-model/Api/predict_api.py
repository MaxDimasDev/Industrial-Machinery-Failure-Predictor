from flask import Flask, request, jsonify
import joblib
import pandas as pd
from pathlib import Path
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)

# Cargar modelo
MODEL_PATH = Path("../ml/model.joblib")
model = joblib.load(MODEL_PATH)

# Codificadores (simplificado para el ejemplo)
le_error = LabelEncoder()
le_error.classes_ = ["NONE", "OVERHEAT", "LOW_OIL", "VIBRATION_ALERT"]

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # 1. Obtener datos
        input_data = request.json
        
        # 2. Preprocesamiento (similar al entrenamiento)
        input_df = pd.DataFrame([input_data])
        input_df["error_code"] = le_error.transform([input_data["error_code"]])[0]
        input_df["days_since_maintenance"] = (pd.Timestamp.now() - pd.to_datetime(input_data["last_maintenance"])).days
        
        # 3. Seleccionar características
        features = [
            "running_hours", "temperature", "vibration", "pressure",
            "oil_level", "error_code", "days_since_maintenance"
        ]
        input_df = input_df[features]
        
        # 4. Predecir
        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0][1]
        
        return jsonify({
            "prediction": int(prediction),
            "probability": float(probability),
            "critical_factors": get_critical_factors(model, input_df)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_critical_factors(model, input_df):
    """Identifica los factores más importantes para la predicción"""
    if hasattr(model, "feature_importances_"):
        features = input_df.columns
        importances = model.feature_importances_
        sorted_idx = importances.argsort()[::-1]
        return {
            "top_factor": features[sorted_idx[0]],
            "top_3": [
                {"feature": features[i], "importance": float(importances[i])}
                for i in sorted_idx[:3]
            ]
        }
    return {}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)