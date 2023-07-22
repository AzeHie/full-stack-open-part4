const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const bcrypt = require('bcryptjs');
const User = require('../models/user');

// initialize testing database
beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('salasana', 10);
  const user = new User({
    username: 'root',
    name: 'root root',
    passwordHash,
  });

  await user.save();
});

describe('get users', () => {
  test('All users are returned correctly as json', async () => {
    const res = await api.get('/api/users');

    expect(res.body).toHaveLength(1);
    expect(res.status).toBe(200);
    expect(res.type).toMatch(/application\/json/);
  });
});

describe('creating user', () => {
  test('creation succeeds with correct details', async () => {
    const responseStart = await api.get('/api/users');
    const usersAtStart = responseStart.body;

    const newUser = {
      username: 'Testi seppo',
      name: 'Seppo',
      password: 'salasana',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const responseEnd = await api.get('/api/users');
    const usersAtEnd = responseEnd.body;

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('Creating user with empty or too short password fails with status code 400 and error message', async () => {
    const newUser = {
      username: 'test user',
      name: 'Test name',
      password: '',
    };

    const res = await api.post('/api/users').send(newUser);

    // result is the same with the password including 1-2 characters
    expect(res.body.message).toBe('Password has to be atleast 3 characters long!');
    expect(res.status).toBe(400);
  });

  test('Creating user with empty or invalid username fails with status code 400 and error message', async () => {
    const newUser = {
      username: 'j',
      name: 'test name again',
      password: 'somepass'
    };

    const newUserWithoutUsername = {
      ...newUser,
      username: ''
    }

    const resWith = await api.post('/api/users').send(newUser);
    const resWithout = await api.post('/api/users').send(newUserWithoutUsername);

    expect(resWith.body.error).toBe('User validation failed: username: Username must be at least 3 characters long.');
    expect(resWith.status).toBe(400);
    expect(resWithout.body.error).toBe('User validation failed: username: Path `username` is required.');
    expect(resWithout.status).toBe(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
