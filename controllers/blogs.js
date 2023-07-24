const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');
const User = require('../models/user');
const config = require('../utils/config');

blogsRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
    });

    res.status(200).json(blogs);
  } catch (err) {
    next(err);
  }
});

blogsRouter.post('/', async (req, res, next) => {
  const { title, author, url, likes } = req.body;

  const decodedToken = jwt.verify(req.token, config.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' });
  }

  const user = await User.findById(decodedToken.id);
  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id,
  });

  if (!req.body.likes) {
    req.body.likes = 0;
  }

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    res.status(201).json(savedBlog);
  } catch (err) {
    next(err);
  }
});

blogsRouter.delete('/:id', async (req, res, next) => {
  const blogId = req.params.id;

  try {
    const decodedToken = jwt.verify(req.token, config.SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' });
    }

    const userId = decodedToken.id;
    const blog = await Blog.findById(blogId);

    if (blog.user.toString() === userId) {
      await Blog.findByIdAndDelete(blogId);
      res.status(200).json({ message: 'Blog deleted' });
    } else {
      res.status(401).json({ message: "Blog deletion failed, you can only delete your own blogs!"})
    }
  } catch (err) {
    next(err);
  }
});

blogsRouter.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  const blog = req.body;

  try {
    const response = await Blog.findByIdAndUpdate(id, blog, { new: true });
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

module.exports = blogsRouter;
