import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';



const createPost = asyncHandler(async (req, res) => {
  const { title, content, categories } = req.body;
  let headerImageUrl;

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'whisperedEmbraces/images',
      });
      headerImageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); 
    } catch (error) {
      res.status(500);
      throw new Error('Image upload to Cloudinary failed');
    }
  }

  const post = new Post({
    title,
    content,
    headerImage: headerImageUrl,
    categories,
    author: req.user._id,
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
});


const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate('author', 'username');
  res.status(200).json(posts);
});


const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username');
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});


const updatePost = asyncHandler(async (req, res) => {
  const { title, content, headerImage, categories } = req.body;
  const post = await Post.findById(req.params.id);

  if (post && post.author.toString() === req.user._id.toString()) {
    post.title = title || post.title;
    post.content = content || post.content;
    post.headerImage = headerImage || post.headerImage;
    post.categories = categories || post.categories;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } else {
    res.status(401);
    throw new Error('Not authorized to update this post');
  }
});


const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post && post.author.toString() === req.user._id.toString()) {
    await post.deleteOne();
    res.status(200).json({ message: 'Post removed' });
  } else {
    res.status(401);
    throw new Error('Not authorized to delete this post');
  }
});

export { createPost, getPosts, getPostById, updatePost, deletePost };
