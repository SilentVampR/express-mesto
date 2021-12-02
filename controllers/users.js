const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SALT_ROUND = 10;
const JWT_SECRET = 'some_secret';

const getErrors = (data) => Object.values(data.errors).map((error) => error.message);

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Не все обязательные поля заполнены' });
  }
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return res
          .status(409)
          .send({ message: 'Пользователь с таким email уже зарегистрирован' });
        // throw new error('Пользователь с таким email уже зарегистрирован');
      }
      return bcrypt.hash(password, SALT_ROUND);
    })
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => res
          .status(201)
          .send({ data: user }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return res
              .status(400)
              .send({ message: `Не все поля заполены корректно: ${getErrors(err)}` });
          }
          return res
            .status(500)
            .send({ message: `Ошибка обработки запроса: ${err}` });
        });
    })
    .catch((err) => res
      .status(500)
      .send({ message: `Ошибка обработки запроса: ${err}` }));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res
      .status(200)
      .send({ data: users }))
    .catch((err) => res
      .status(500)
      .send({ message: `Ошибка обработки запроса: ${err}` }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res
        .status(200)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Некорректное значение ID пользователя' });
      }
      return res
        .status(500)
        .send({ message: `Ошибка обработки запроса: ${err}` });
    });
};

module.exports.getMe = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res
        .status(200)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Некорректное значение ID пользователя' });
      }
      return res
        .status(500)
        .send({ message: `Ошибка обработки запроса: ${err}` });
    });
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res
        .status(202)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: `Не все поля заполены корректно: ${getErrors(err)}` });
      }
      return res
        .status(500)
        .send({ message: `Ошибка обработки запроса: ${err}` });
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res
        .status(202)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: `Не все поля заполены корректно: ${getErrors(err)}` });
      }
      return res
        .status(500)
        .send({ message: `Ошибка обработки запроса: ${err}` });
    });
};

module.exports.login = (req, res) => {
  const {
    email,
    password,
  } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .send({ message: 'Неверный логин или пароль 1' });
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            return res
              .status(401)
              .send({ message: 'Неверный логин или пароль 2' });
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
          return res
            .status(200)
            .cookie('jwt', token, {
              maxAge: 3600000,
              httpOnly: true,
            })
            // .end();
            .send({ jwt: token });
        })
        .catch((err) => res
          .status(500)
          .send({ message: `Ошибка обработки запроса: ${err}` }));
    })

    .catch((err) => res
      .status(500)
      .send({ message: `Ошибка обработки запроса: ${err}` }));
};
