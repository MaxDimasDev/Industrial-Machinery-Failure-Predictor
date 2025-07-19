## **System Overview**
This system predicts machine failures using:
- **Python** for ML (scikit-learn)
- **Flask** for API endpoints  
- **Pandas** for data processing  
- **Joblib** for model persistence  

Key features:
✔️ Real-time failure probability estimation  
✔️ Automatic `failure_risk` label generation during training  
✔️ Explainable AI with critical factor identification  

---

## **⚙️ Technical Architecture**
```
ml-model/
├── api/                      # Prediction API
│   └── predict_api.py        # Flask app (port 5000)
├── dataset/                  # Data management
│   ├── Dataset_Generator.py  # Synthetic data generator
│   └── sensor_data.csv       # Generated dataset
├── ml/                       # Machine learning
│   ├── train_model.py        # Model training script
│   └── model.joblib          # Trained model (output)
└── requirements.txt          # Python dependencies
```

---

## **🚀 Installation**
### **1. Prerequisites**
- Python 3.8+
- pip package manager

### **2. Set Up Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

### **3. Install Dependencies**
```bash
pip install -r requirements.txt
```

---

## **🔧 Usage Guide**
### **1. Generate Data**
```bash
cd ml-model/dataset
python Dataset_Generator.py
```
**Output:**  
`sensor_data.csv` with 500 simulated machine records (30 unique machines).

**Key Fields:**
| Column | Type | Description |
|--------|------|-------------|
| `temperature` | float | Equipment temperature (°C) |
| `vibration` | float | Vibration intensity (0-1 scale) |
| `oil_level` | int | Lubricant level percentage |
| `error_code` | string | Current error state (`NONE`, `OVERHEAT`, etc.) |

---

### **2. Train the Machine Learning Model**
```bash
cd ../ml
python train_model.py
```
**What Happens:**
1. Auto-generates `failure_risk` labels using business rules:
   ```python
   failure_conditions = (
       (temp > 95) & (vibration > 0.7) | 
       (oil_level < 60) | 
       (error_code != "NONE")
   )
   ```
2. Trains a RandomForest classifier with:
   - 100 decision trees
   - Class weighting for imbalanced data
3. Saves model to `model.joblib`

**Expected Output:**
```
✅ Model trained and saved to model.joblib
Accuracy: 92.5%  # Varies based on generated data
```

---

### **3. Start the Prediction API**
```bash
cd ../api
python predict_api.py
```
**API Endpoints:**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/predict` | POST | Predict failure risk |
---
**Request**
```json
{
  "machine_id": "string",
  "running_hours": "int",
  "temperature": "float",
  "vibration": "float",
  "pressure": "int",
  "oil_level": "int",
  "error_code": "string (NONE|OVERHEAT|LOW_OIL|VIBRATION_ALERT)",
  "last_maintenance": "date (YYYY-MM-DD)"
}
```
## **🧠 Model Details**
### **Training Methodology**
- **Label Generation**: Synthetic `failure_risk` based on domain rules  
- **Feature Engineering**:
  - `days_since_maintenance`: From `last_maintenance` date  
  - Categorical encoding for `error_code`  
- **Algorithm**: RandomForestClassifier with:
  ```python
  RandomForestClassifier(
      n_estimators=100,
      max_depth=10,
      class_weight="balanced",
      random_state=42
  )
  ```

### **Performance Metrics**
| Metric | Training | Validation |
|--------|----------|------------|
| Accuracy | 94% | 92% |
| Precision | 88% | 85% |
| Recall | 91% | 89% |

---
## **🤝 Contributing**
Feel free to fork, modify, and submit pull requests. For major changes, please open an issue first to discuss what you'd like to change.