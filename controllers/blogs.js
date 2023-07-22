const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

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
  const { title, author, url, likes, userId } = req.body;

  const user = await User.findById(userId);
  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: userId,
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
  const id = req.params.id;

  try {
    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: 'Blog deleted' });
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
