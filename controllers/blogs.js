const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({});

    res.status(200).json(blogs);
  } catch (err) {
    next(err);
  }
});

blogsRouter.post('/', async (req, res, next) => {
  if (!req.body.likes) {
    req.body.likes = 0;
  }

  const blog = new Blog(req.body);

  try {
    const result = await blog.save();
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = blogsRouter;
