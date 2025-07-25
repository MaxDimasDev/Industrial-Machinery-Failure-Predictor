from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)

# Cargar modelo
model = joblib.load("../ml/model.joblib")

# Configurar LabelEncoder (debe coincidir con el frontend)
le_error = LabelEncoder()
le_error.classes_ = np.array(["NONE", "OVERHEAT", "LOW_OIL", "HIGH_VIBRATION"])

# Threshold ajustable
PREDICTION_THRESHOLD = 0.65  # 65% de confianza para considerar falla

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # 1. Validar entrada
        if not request.json:
            return jsonify({"error": "No JSON data received"}), 400

        input_data = request.json
        
        # 2. Validar campos
        required_fields = [
            "machine_id", "temperature", "vibration", 
            "oil_level", "error_code", "last_maintenance",
            "pressure", "running_hours"
        ]
        if not all(field in input_data for field in required_fields):
            return jsonify({"error": f"Missing fields: {required_fields}"}), 400

        # 3. Preprocesamiento
        input_df = pd.DataFrame({
            "running_hours": [int(input_data["running_hours"])],
            "temperature": [float(input_data["temperature"])],
            "vibration": [float(input_data["vibration"])],
            "pressure": [int(input_data["pressure"])],
            "oil_level": [int(input_data["oil_level"])],
            "error_code": [le_error.transform([input_data["error_code"]])[0]],
            "days_since_maintenance": [
                (datetime.now() - pd.to_datetime(input_data["last_maintenance"])).days
            ]
        })

        # 4. Asegurar orden de features
        features_order = model.feature_names_in_
        
        # 5. Predecir con threshold
        probability = model.predict_proba(input_df[features_order])[0][1]
        prediction = 1 if probability > PREDICTION_THRESHOLD else 0

        return jsonify({
            "prediction": int(prediction),
            "probability": float(probability),
            "threshold": float(PREDICTION_THRESHOLD),
            "status": "success",
            "features_used": list(features_order)
        })

    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route("/model_info", methods=["GET"])
def model_info():
    return jsonify({
        "feature_names": list(model.feature_names_in_),
        "classes": list(model.classes_),
        "threshold": PREDICTION_THRESHOLD,
        "model_type": "RandomForest"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)