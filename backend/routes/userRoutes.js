const express = require('express');
const { registerUser, loginUser, fetchUsers, blockUser, deleteUserById, unblockUser } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', authenticateToken, fetchUsers);
router.put('/block/:userId', authenticateToken, blockUser);
router.delete('/delete/:userId', authenticateToken, deleteUserById);
router.put('/unblock/:userId', authenticateToken, unblockUser); 
module.exports = router;
