import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
from pathlib import Path
from sklearn.preprocessing import LabelEncoder
from sklearn.utils import resample
from sklearn.metrics import classification_report

# Rutas
DATASET_PATH = Path("../dataset/sensor_data.csv")
MODEL_PATH = Path("model.joblib")

def train_model():
    try:
        # 1. Cargar datos
        print("⏳ Cargando dataset...")
        data = pd.read_csv(DATASET_PATH)
        
        # 2. Definir variable objetivo
        print("🔧 Creando variable failure_risk...")
        data["failure_risk"] = (
            ((data["temperature"] > 85) & (data["vibration"] > 0.8)) |
            (data["oil_level"] < 45) |
            ((data["error_code"] != "NONE") & (data["running_hours"] > 500))
        ).astype(int)
        
        # 3. Separar clases
        print("⚖️ Balanceando clases...")
        df_normal = data[data["failure_risk"] == 0].copy()
        df_failure = data[data["failure_risk"] == 1].copy()
        
        # Verificar que tenemos datos
        if len(df_normal) == 0 or len(df_failure) == 0:
            raise ValueError("❌ Dataset no contiene ambas clases (0 y 1)")

        # 4. Balancear muestreando la clase mayoritaria
        df_normal_sampled = resample(
            df_normal,
            replace=False,
            n_samples=len(df_failure),
            random_state=42
        )

        # 5. Combinar datos balanceados de forma segura
        print("📦 Concatenando datos balanceados...")
        dfs_validos = [df for df in [df_normal_sampled, df_failure] if df is not None and not df.empty]
        if not dfs_validos:
            raise ValueError("❌ No hay datos válidos para balancear y entrenar.")
        data_balanced = pd.concat(dfs_validos, axis=0)

        # 6. Codificar variables categóricas
        print("🔠 Codificando variables...")
        le = LabelEncoder()
        data_balanced["error_code"] = le.fit_transform(data_balanced["error_code"])
        
        # 7. Calcular días desde mantenimiento
        data_balanced["last_maintenance"] = pd.to_datetime(data_balanced["last_maintenance"])
        data_balanced["days_since_maintenance"] = (pd.Timestamp.now() - data_balanced["last_maintenance"]).dt.days
        
        # 8. Seleccionar features
        features = [
            "running_hours", "temperature", "vibration", "pressure",
            "oil_level", "error_code", "days_since_maintenance"
        ]
        X = data_balanced[features]
        y = data_balanced["failure_risk"]
        
        # 9. Dividir datos
        print("✂️ Dividiendo dataset...")
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # 10. Entrenar modelo
        print("🏋️ Entrenando modelo...")
        model = RandomForestClassifier(
            n_estimators=200,
            max_depth=10,
            class_weight="balanced",
            random_state=42,
            verbose=1
        )
        model.fit(X_train, y_train)
        
        # 11. Evaluar
        print("\n📊 Evaluación del Modelo:")
        print(classification_report(y_test, model.predict(X_test)))
        
        # 12. Guardar modelo
        joblib.dump(model, MODEL_PATH)
        print(f"\n✅ Modelo guardado en {MODEL_PATH}")
        print(f"📊 Distribución final de clases:\n{pd.value_counts(y)}")
        
    except Exception as e:
        print(f"\n❌ Error durante el entrenamiento: {str(e)}")
        raise

if __name__ == "__main__":
    train_model()
