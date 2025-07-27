# 🏭 Industrial Machinery Failure Predictor

A full-stack application that monitors industrial machines and predicts potential failures using machine learning. It provides a web interface for machine data entry, a backend with CRUD functionality, and an ML-powered API that predicts failure risks based on sensor data.

## 📦 Project Structure
```
├── frontend/       # React.js UI
├── backend/        # Node.js API + PostgreSQL
└── ml-model/       # Python ML model + Flask API
```
## 💡 Key Features

- ✅ Create, read, update, and delete machine data
- ✅ Predict failure probability with real-time results
- ✅ Data-driven UI with historical and predicted metrics
- ✅ Explainable ML logic based on business rules
- ✅ Modular architecture (Frontend ↔ Backend ↔ ML API)

## 🧠 Tech Stack
```
| Layer     | Tech                              |
|-----------|-----------------------------------|
| Frontend  | React, Vite, Axios                |
| Backend   | Node.js, Express, Sequelize (PostgreSQL) |
| ML Model  | Python, scikit-learn, Flask       |
| DB        | PostgreSQL                        |
```
## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-username/machine-failure-predictor.git
cd machine-failure-predictor
```

### 2. Set up each part

Follow the setup instructions in the following files:
```
* [Frontend Setup](./frontend/Setup.frontend.md)
* [Backend Setup](./backend/backend.setup.md)
* [Database](./database/SetupDatabase.md)
* [ML Model Setup](./ml-model/Setup.md)
```
## 🔗 API Overview
```
| Endpoint          | Method | Description            |
| ----------------- | ------ | ---------------------- |
| `/machines`       | POST   | Add a new machine      |
| `/machines`       | GET    | Get all machines       |
| `/machines/:name` | GET    | Get a specific machine |
| `/machines/:name` | PUT    | Update a machine       |
| `/machines/:name` | DELETE | Delete a machine       |
| `/predict`        | POST   | Predict failure risk   |
```

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you’d like to change. This project aims to be a solid reference for ML-based monitoring systems in industrial contexts.