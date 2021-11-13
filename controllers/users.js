const User = require('../models/user');

const getErrors = (data) => {
  return Object.values(data.errors).map(error => error.message)
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.query;
  User.create({ name, about, avatar })
    .then(user => {
      return res
        .status(201)
        .send({ data: user });
    })
    .catch(err => {

      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Не все поля заполены корректно: ' + getErrors(err) })
      }
      return res
        .status(500)
        .send({ message: 'Ошибка обработки запроса: ' + err })
    })
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => {
      return res
        .status(200)
        .send({ data: users })
    })
    .catch(err => {
      return res
        .status(500)
        .send({ message: 'Ошибка обработки запроса: ' + err })
    })
}

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' })
      }
      return res
        .status(200)
        .send({ data: user })
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Некорректное значение ID пользователя' })
      }
      return res
        .status(500)
        .send({ message: 'Ошибка обработки запроса: ' + err })
    })
}

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { name: req.query.name, about: req.query.about })
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' })
      }
      return res
        .status(202)
        .send({ data: user })
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Не все поля заполены корректно: ' + getErrors(err) })
      }
      return res
        .status(500)
        .send({ message: 'Ошибка обработки запроса: ' + err })
    })
}

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.query.avatar })
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' })
      }
      return res
        .status(202)
        .send({ data: user })
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Не все поля заполены корректно: ' + getErrors(err) })
      }
      return res
        .status(500)
        .send({ message: 'Ошибка обработки запроса: ' + err })
    })
}