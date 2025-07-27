# 🖥️ Frontend Setup - Industrial Machinery Failure Predictor

This guide helps you run the React-based frontend for the machinery failure prediction system.


## 📋 Prerequisites

Make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- Backend API running on **http://localhost:3001**
- ML API running on **http://localhost:5000**


## 🚀 Installation Steps


### 1. Navigate to the frontend directory

```bash
cd frontend
```


### 2. Install dependencies

```bash
npm install
```


## 🌐 Environment Variables

Create a `.env` file in the `frontend` directory and configure:

```env
VITE_API_URL=http://localhost:3001
```


## 🔧 Running the Development Server

```bash
npm run dev
```

This will start the app on `http://localhost:5173` by default.


## ✅ Done!

Your frontend is now running. Visit [http://localhost:5173](http://localhost:5173) to test the system.


## 🧩 Folder Structure

src/
├── components/       # UI components (cards, forms, alerts)
├── services/         # Axios API integration
├── styles/           # CSS styles
├── app.jsx           # Main App logic
└── main.jsx          # Entry point


## 💬 Functionality Overview

* **MachineCard**: Displays machine info
* **MachineForm**: Form to register/edit machines
* **PredictionForm**: Inputs for ML model
* **PredictionCard**: Shows prediction results
* **AlertPanel**: Displays warnings/errors
* **api.js**: Axios calls to backend routes

