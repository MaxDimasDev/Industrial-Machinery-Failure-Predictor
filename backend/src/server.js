require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');
const apiRouter = require('./routes/api.routes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', apiRouter);

// Database sync and server start
sequelize.sync({ alter: true })
  .then(() => {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Database sync failed:', err);
  });