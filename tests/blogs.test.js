const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

describe('get requests', () => {
  test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(2);
    expect(response.status).toBe(200);
    expect(response.type).toMatch(/application\/json/);
  });

  test('blogs are identified by id instead of _id', async () => {
    const response = await api.get('/api/blogs');
    const blogs = response.body;

    blogs.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });
});

describe('post requests', () => {
  test.only('new blog is added to the database', async () => {
    let blogs;
    blogs = await api.get('/api/blogs');
    const blogsAtStart = blogs.body.length;

    const newBlog = {
      title: 'test blog title',
      author: 'test author',
      url: 'testurlhastobeatleast10characters',
      likes: 2,
    };
    const response = await api.post('/api/blogs').send(newBlog);

    blogs = await api.get('/api/blogs');
    const blogsAtEnd = blogs.body.length;

    expect(response.status).toBe(201);
    expect(blogsAtEnd).toBeGreaterThan(blogsAtStart);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
