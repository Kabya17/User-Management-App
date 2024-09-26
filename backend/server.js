const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();
const app = express();

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(express.json());
app.use('/', userRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the User Management API! Use /api/register, /api/login, etc. to interact with the API.');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
