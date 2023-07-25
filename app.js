const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const { requestLogger, unknownEndpoint, errorHandler, tokenExtractor, userExtractor } = require('./utils/middleware');
const logger = require('./utils/logger');
const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

mongoose.set('strictQuery', false);

logger.info('Connecting to mongoDB..');

mongoose.connect(config.MONGODB_URI).then(()=> {
  logger.info('Connected to database');
}).catch((err) => {
  logger.error("Error connecting to database: ", err.message);
});

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(requestLogger);
app.use(tokenExtractor);

app.use('/api/users', usersRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/login', loginRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
