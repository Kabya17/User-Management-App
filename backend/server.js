const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();
const app = express();

app.use(cors({
  origin: 'https://user-management-app-frontend.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization','X-Requested-With', 'Accept'],
  credentials: true, 
}));

app.use(express.json());
app.use('/api', userRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the User Management API! Use /api/register, /api/login, etc. to interact with the API.');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




