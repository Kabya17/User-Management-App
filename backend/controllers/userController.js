const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail, getAllUsers, updateUserStatus, deleteUser, updateLoginTime } = require('../models/userModel');

const registerUser = (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Error hashing password' });
    createUser(name, email, hashedPassword, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error registering user' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

const loginUser = (req, res) => {
  console.log('Login function called');
  const { email, password } = req.body;
  getUserByEmail(email, (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.status === 'blocked') return res.status(403).json({ error: 'User is blocked' });
    bcrypt.compare(password, user.password, (err, match) => {
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });
      console.log('JWT Secret:', process.env.JWT_SECRET);
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Generated token:', token);
      updateLoginTime(user.id, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error updating login time' });
        }
        console.log('Updated login time for user:', user.id);
        res.status(200).json({ token, userId: user.id, });
      });
    });
  });
};

const fetchUsers = (req, res) => {
  getAllUsers((err, users) => {
    if (err) return res.status(500).json({ error: 'Error fetching users' });
    res.status(200).json(users);
  });
};

const blockUser = (req, res) => {
  const { userId } = req.params;
  updateUserStatus(userId, 'blocked', (err) => {
    if (err) return res.status(500).json({ error: 'Error blocking user' });
    res.status(200).json({ message: 'User blocked' });
  });
};

const deleteUserById = (req, res) => {
  const { userId } = req.params;
  deleteUser(userId, (err) => {
    if (err) return res.status(500).json({ error: 'Error deleting user' });
    res.status(200).json({ message: 'User deleted' });
  });
};

const unblockUser = (req, res) => {
  const { userId } = req.params;
  updateUserStatus(userId, 'active', (err) => {
    if (err) return res.status(500).json({ error: 'Error unblocking user' });
    res.status(200).json({ message: 'User unblocked' });
  });
};

module.exports = { registerUser, loginUser, fetchUsers, blockUser, deleteUserById, unblockUser };
