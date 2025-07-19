from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from datetime import datetime

app = Flask(__name__)

# Cargar modelo
model = joblib.load("../ml/model.joblib")

# Configurar LabelEncoder
le_error = LabelEncoder()
le_error.classes_ = np.array(["NONE", "OVERHEAT", "LOW_OIL", "VIBRATION_ALERT"])

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # 1. Validar entrada
        if not request.json:
            return jsonify({"error": "No JSON data received"}), 400

        input_data = request.json
        
        # 2. Validar campos (ahora incluyendo los nuevos)
        required_fields = [
            "machine_id", "temperature", "vibration", 
            "oil_level", "error_code", "last_maintenance",
            "pressure", "running_hours"  # ¡Nuevos campos requeridos!
        ]
        if not all(field in input_data for field in required_fields):
            return jsonify({"error": f"Missing fields: {required_fields}"}), 400

        # 3. Preprocesamiento completo
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

        # 4. Asegurar el orden correcto de features
        features_order = [
            "running_hours", "temperature", "vibration", 
            "pressure", "oil_level", "error_code", 
            "days_since_maintenance"
        ]
        
        # Debug: Verificar coincidencia con el modelo
        print("Features en el modelo:", model.feature_names_in_)
        print("Features enviadas:", features_order)

        # 5. Predecir
        prediction = model.predict(input_df[features_order])[0]
        probability = model.predict_proba(input_df[features_order])[0][1]

        return jsonify({
            "prediction": int(prediction),
            "probability": float(probability),
            "status": "success",
            "features_used": features_order
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)