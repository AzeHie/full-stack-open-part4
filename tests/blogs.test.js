const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

describe('get requests', () => {
  test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs');
    // expect(response.body).toHaveLength(2);
    // REMOVED PREVIOUS LINE, BECAUSE THERE IS A LOT OF BLOGS ADDED IN THE LATER TESTS
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
  test('new blog is added to the database', async () => {
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

  test('if likes is empty, its modified to 0', async () => {
    const newBlog = {
      title: 'and yet another test title',
      author: 'Another test author',
      url: 'Anothertesturlhastobeatleast10',
      likes: '',
    };
    const response = await api.post('/api/blogs').send(newBlog);
    const blogs = await api.get('/api/blogs');
    const lastBlog = blogs.body[blogs.body.length - 1];

    expect(response.status).toBe(201);
    expect(lastBlog.likes).toBe(0);
  });

  test('if title is empty, response status code should be 400', async () => {
    const newBlog = {
      title: '',
      author: 'Another test author',
      url: 'Anothertesturlhastobeatleast10',
      likes: 3,
    };

    const response = await api.post('/api/blogs').send(newBlog);
    expect(response.status).toBe(400);
  });

  test('if url is empty, response status code should be 400', async () => {
    const newBlog = {
      title: 'Some test title here too',
      author: 'Another test author',
      url: '',
      likes: 3,
    };

    const response = await api.post('/api/blogs').send(newBlog);
    expect(response.status).toBe(400);
  });
});

describe('delete requests', () => {
  test('single blog is deleted successfully', async () => {
    const newBlog = {
      title: 'Testing delete',
      author: 'Delete testing',
      url: 'someurlwhichisatleast10',
      likes: 6,
    };

    // save new blog
    const saveResult = await api.post('/api/blogs').send(newBlog);

    let blogs;

    // get blogs before delete
    blogs = await api.get('/api/blogs');
    const blogsBefore = blogs.body.length;

    // delete blog
    const response = await api.delete(`/api/blogs/${saveResult.body.id}`);

    // get blogs after delete
    blogs = await api.get('/api/blogs');
    const blogsAfter = blogs.body.length;

    expect(response.status).toBe(200);
    expect(blogsAfter).toBeLessThan(blogsBefore);
  });
});

describe('put requests', () => {
  test('likes updated successfully', async () => {
    const blogs = await api.get('/api/blogs');
    const blog = blogs.body[0];

    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    };

    const response = await api.put(`/api/blogs/${blog.id}`).send(updatedBlog);

    expect(response.body.id).toBe(blog.id);
    expect(response.body.likes).toBe(blog.likes + 1);
    expect(response.status).toBe(200);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});