const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const {
  createUser,
  login,
} = require('./controllers/users');

const NotFoundError = require('./errors/not-found-err');

// Импортируем маршруты
const { auth } = require('./middlewares/auth');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

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
app.use(auth);
app.use(userRoutes);
app.use(cardRoutes);
app.use(() => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? `На сервере произошла ошибка ${err}`
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log('Сервер запущен на порту', PORT);
});
