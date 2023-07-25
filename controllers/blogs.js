const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware');

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

blogsRouter.post('/', userExtractor, async (req, res, next) => {
  if (!req.body.likes) {
    req.body.likes = 0;
  }

  const { title, author, url, likes } = req.body;
  const user = req.user;

  if (!user.id) {
    return res.status(401).json({ error: 'token invalid' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user.id,
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    res.status(201).json(savedBlog);
  } catch (err) {
    next(err);
  }
});

blogsRouter.delete('/:id', userExtractor, async (req, res, next) => {
  const blogId = req.params.id;
  const user = req.user;

  try {
    if (!user.id) {
      return res.status(401).json({ error: 'token invalid' });
    }

    const blog = await Blog.findById(blogId);

    if (blog.user.toString() === user.id) {
      await Blog.findByIdAndDelete(blogId);
      res.status(200).json({ message: 'Blog deleted' });
    } else {
      res.status(401).json({ message: "Blog deletion failed, you can only delete your own blogs!"})
    }
  } catch (err) {
    next(err);
  }
});

blogsRouter.put('/:id', userExtractor, async (req, res, next) => {
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
