import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Configuración
np.random.seed(42)
n_machines = 30
n_rows = 500

# Datos simulados
data = {
    "machine_id": np.random.randint(1, n_machines + 1, n_rows),
    "machine_name": np.random.choice(["Torno CNC", "Fresadora CNC", "Rectificadora", "Prensa hidráulica", "Máquina de soldadura (MIG/TIG/Arco)", 
    "Cortadora láser/plasma", "Dobladora de tubos y láminas", "Inyectora de plástico", "Mezcladora industrial", "Molino de bolas", "Extrusora", 
    "Horno industrial", "Trituradora/molino", "Tamizadora", "Montacargas", "Banda transportadora", "Apiladora/recogedora automática", 
    "Grúa puente", "Microscopio industrial", "Durómetro", "CMM (Máquina de medición por coordenadas)", "Espectrómetro", "Compresor de aire", 
    "Bomba centrífuga", "Caldera industrial", "Torre de enfriamiento", "Generador eléctrico", "Sistema de filtración", "Ventilador industrial", 
    "Máquina de envasado"], n_rows),
    "location": np.random.choice([f"Sala {i}{chr(65 + j)}" for i in range(1,5) for j in range(3)], n_rows),
    "running_hours": np.random.randint(50, 1000, n_rows),
    "temperature": np.random.normal(85, 15, n_rows).round(1),
    "vibration": np.random.uniform(0.1, 0.9, n_rows).round(1),
    "pressure": np.random.randint(80, 250, n_rows),
    "oil_level": np.random.randint(50, 100, n_rows),
    "error_code": np.random.choice(["NONE", "OVERHEAT", "LOW_OIL", "VIBRATION_ALERT"], n_rows, p=[0.7, 0.1, 0.1, 0.1]),
    "last_maintenance": [(datetime.now() - timedelta(days=np.random.randint(1, 180))).strftime("%Y-%m-%d") for _ in range(n_rows)],
    "failure_risk": np.random.choice([0, 1], n_rows, p=[0.85, 0.15])  # 15% de fallas
}

pd.DataFrame(data).to_csv("sensor_data.csv", index=False)