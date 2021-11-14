const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

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
    _id: '618f45c12a6abf6acc042a83'
  };
  next();
});

app.use(userRoutes);
app.use(cardRoutes);

app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту номер ${PORT}`);
})