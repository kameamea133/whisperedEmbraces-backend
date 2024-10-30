import express from 'express';
import { getPosts, getPostById, createPost, updatePost, deletePost } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';


const router = express.Router();

router.route('/').get(getPosts).post(protect, upload.single('headerImage'), createPost);

router.route('/:id').get(getPostById).put(protect, updatePost).delete(protect, deletePost);

export default router;
