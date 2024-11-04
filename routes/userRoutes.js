import express from 'express';
import {registerUser, loginUser, logoutUser, updateUserProfile} from '../controllers/userController.js';
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/logout').post(logoutUser);

router.put('/profile', protect, updateUserProfile);

export default router