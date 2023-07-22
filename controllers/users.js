const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({});

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

usersRouter.post('/', async (req, res, next) => {
  const { username, name, password } = req.body;

  if (password.length < 3) {
    res
      .status(400)
      .json({ message: 'Password has to be atleast 3 characters long!' });
  }

  let passwordHash;
  try {
    passwordHash = await bcrypt.hash(password, 10);
  } catch (err) {
    next(err);
  }

  const user = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
});

module.exports = usersRouter;
