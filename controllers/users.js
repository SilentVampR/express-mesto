const User = require('../models/user');

const getErrors = (data) => Object.values(data.errors).map((error) => error.message);

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
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
