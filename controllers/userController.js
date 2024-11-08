import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
  
    const userExists = await User.findOne({ email });
  
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
  
    const user = await User.create({
      username,
      email,
      password,
    });
  
    if (user) {
      generateToken(res, user._id);
  
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  });

  const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });

    
    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),  
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    
    if (req.body.newPassword) {
      user.password = req.body.newPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});



  export { registerUser, loginUser, logoutUser, updateUserProfile };