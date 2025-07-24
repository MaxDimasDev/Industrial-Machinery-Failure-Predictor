# Backend Setup Guide

## Requirements
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
PG_USER=postgres
PG_PASSWORD=
PG_HOST=localhost
PG_DATABASE=machine_failure_db
PG_PORT=5432
```