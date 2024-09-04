import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

// User must be authenticated
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;
  console.log('Received token from cookies:', token); // Debugging statement
 
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); // Debugging statement

      req.user = await User.findById(decoded.userId).select('-password');
      console.log('Authenticated user:', req.user); // Debugging statement

      if (!req.user) {
        console.error('User not found in the database');
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.error('No token provided in cookies');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
});

// User must be an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    console.error('Not authorized as an admin');
    return res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

export { protect, admin };
