const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');
const { requestLogger, unknownEndpoint, errorHandler } = require('./utils/middleware');

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

app.use('/api/blogs', blogsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
