# Backend Setup Guide

## Requirements
Make sure to chanche directories to backend before running the following commands:
```bash
npm init -y
npm install express axios cors
npm install pg sequelize
```

- Node.js 16+
- PostgreSQL 13+
- Python ML service running on port 5000

## Environment Variables
Create `.env` file with:

```env
#Server
PORT=3001

#ML service
ML_API_URL=http://localhost:5000/predict

#PostgreSQL
PG_USER=YOUR_USERNAME
PG_PASSWORD=YOUR_PASSWORD
PG_HOST=localhost
PG_DATABASE=YOUR_DATABASE_NAME
PG_PORT=5432
```