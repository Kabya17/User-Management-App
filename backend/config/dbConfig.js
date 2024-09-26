const mysql = require('mysql2');
const fs = require('fs'); 
const path = require('path');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: true, 
    ca: fs.readFileSync(path.join(__dirname, 'aiven-ca-cert.pem'), 'utf8'),
  },
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  } else {
    console.log('Connected to MySQL on Aiven');
  }
});

module.exports = db;
