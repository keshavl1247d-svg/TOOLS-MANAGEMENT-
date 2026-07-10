require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
// Middleware
// This checks if FRONTEND_URL is set in environment variables, otherwise defaults to your Vercel URL
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'https://tools-management-l7zq.vercel.app', 
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/parts', require('./routes/parts'));
app.use('/api/tools', require('./routes/tools'));
app.use('/api/inout', require('./routes/inout'));
app.use('/api/search', require('./routes/search'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
