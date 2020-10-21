require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { articleRouter, usersRouter, errorRouter } = require('./routers');
const errorHandler = require('./middlewares/error-handler.js');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  PORT, DB_SERVER, DB_PORT, DB_NAME,
} = require('./utils/config');
const { limiter } = require('./utils/rate-limiter-config');

const app = express();
app.use(helmet());
app.use(limiter);
mongoose.connect(`mongodb://${DB_SERVER}:${DB_PORT}/${DB_NAME}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(requestLogger);

app.use('/', usersRouter);
app.use('/articles', articleRouter);
app.use('*', errorRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
