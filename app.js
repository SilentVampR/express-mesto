require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');

const { corsConfig } = require('./middlewares/corsconfig');

const {
  createUser,
  login,
  logout,
} = require('./controllers/users');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorhandler');

const NotFoundError = require('./errors/not-found-err');

// Импортируем маршруты
const { auth } = require('./middlewares/auth');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(requestLogger); // Логгер запросов

app.use(cookieParser()); // Работа с cookie

app.use(helmet()); // Активируем helmet
app.disable('x-powered-by'); // Отключаем заголовок принадлежности

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(corsConfig);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.get('/signout', logout);
app.use(auth);
app.use(userRoutes);
app.use(cardRoutes);
app.use(() => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // console.log('Сервер запущен на порту', PORT);
});
