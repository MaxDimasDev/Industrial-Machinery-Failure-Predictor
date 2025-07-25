import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Configuración
np.random.seed(42)
n_machines = 30
n_rows = 1000  # Aumentamos datos para mejor entrenamiento

# Datos simulados con distribución más realista
data = {
    "machine_id": np.random.randint(1, n_machines + 1, n_rows),
    "machine_name": np.random.choice([
        "Torno CNC", "Fresadora CNC", "Rectificadora", "Prensa hidráulica", 
        "Máquina de soldadura", "Cortadora láser", "Dobladora", "Inyectora"
    ], n_rows),
    "location": np.random.choice([f"Sala {i}{chr(65 + j)}" for i in range(1,5) for j in range(3)], n_rows),
    "running_hours": np.random.randint(50, 2000, n_rows),
    "temperature": np.clip(np.random.normal(70, 12, n_rows).round(1), 0, 100),  # Media 70°C, std 12
    "vibration": np.clip(np.random.normal(0.4, 0.3, n_rows).round(2), 0, 2),  # Media 0.4, std 0.3
    "pressure": np.random.randint(80, 220, n_rows),
    "oil_level": np.random.randint(60, 100, n_rows),  # Niveles más altos
    "error_code": np.random.choice(
        ["NONE", "OVERHEAT", "LOW_OIL", "HIGH_VIBRATION"], 
        n_rows, 
        p=[0.85, 0.05, 0.05, 0.05]  # 85% casos normales
    ),
    "last_maintenance": [
        (datetime.now() - timedelta(days=np.random.randint(1, 365)))
        .strftime("%Y-%m-%d") 
        for _ in range(n_rows)
    ]
}

pd.DataFrame(data).to_csv("sensor_data.csv", index=False)
print("✅ Dataset generado con distribución realista")