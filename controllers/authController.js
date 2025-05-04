const jwt = require('jsonwebtoken');
const { User } = require('../models');
const validator = require('validator');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, shopName } = req.body;

    // Validate input
    if (!name || !email || !phone || !password || !shopName) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide name, email, phone, password, and shop name.'
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a valid email address.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User with this email already exists.'
      });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      phone,
      password,
      shopName
    });

    // Generate JWT token
    const token = signToken(newUser.id);

    // Remove password from output
    newUser.password = undefined;

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password!'
      });
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    // 3) If everything ok, send token to client
    const token = signToken(user.id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          shopName: user.shopName
        }
      }
    });
  } catch (err) {
    next(err);
  }
};