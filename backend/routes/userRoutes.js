const express = require('express');
const router = express.Router();
const { changePassword, getUserById, updateUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/:id', getUserById);

router.post('/change-password', changePassword);

router.put('/:id', updateUser);


module.exports = router;
