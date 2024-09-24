const db = require('../config/dbConfig');
const createUsersTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      status ENUM('active', 'blocked') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;
  db.query(query, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Users table created or already exists');
    }
  });
};
createUsersTable();

const createUser = (name, email, password, callback) => {
  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, password], (err, result) => {
    callback(err, result);
  });
};

const getUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, result) => {
    callback(err, result[0]);
  });
};

const getAllUsers = (callback) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    callback(err, results);
  });
};

const updateUserStatus = (userId, status, callback) => {
  const query = 'UPDATE users SET status = ? WHERE id = ?';
  db.query(query, [status, userId], (err, result) => {
    callback(err, result);
  });
};

const deleteUser = (userId, callback) => {
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [userId], (err, result) => {
    callback(err, result);
  });
};

const updateLoginTime = (userId, callback) => {
  const query = 'UPDATE users SET updated_at = NOW() WHERE id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error updating login time:', err);
    }
    callback(err, result);
  });
};

module.exports = {
  createUser,
  getUserByEmail,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  updateLoginTime
};
