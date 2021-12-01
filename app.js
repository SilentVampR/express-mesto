const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  createUser,
  login,
} = require('./controllers/users');

// Импортируем маршруты
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '618f45c12a6abf6acc042a83',
  };
  next();
});
app.post('/signup', createUser);
app.post('/signin', login);
app.use(userRoutes);
app.use(cardRoutes);
app.use((req, res) => res
  .status(404)
  .send({ message: 'Страница не найдена!' }));

app.listen(PORT, () => {
  console.log('Сервер запущен на порту', PORT);
});
