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

blogsRouter.delete('/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: 'Blog deleted'})
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
