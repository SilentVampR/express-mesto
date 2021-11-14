const Card = require('../models/card');

const getErrors = (data) => Object.values(data.errors).map((error) => error.message);

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res
      .status(201)
      .send({ data: card }))
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

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res
      .status(200)
      .send({ data: cards }))
    .catch((err) => res
      .status(500)
      .send({ message: `Ошибка обработки запроса: ${getErrors(err)}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res
        .status(202)
        .send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные для удаления карточки' });
      }
      return res
        .status(500)
        .send({ message: `Ошибка обработки запроса: ${err}` });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res
        .status(404)
        .send({ message: 'Передан несуществующий _id карточки' });
    }
    return res
      .status(202)
      .send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res
        .status(400)
        .send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
    }
    return res
      .status(500)
      .send({ message: `Ошибка обработки запроса: ${err}` });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res
        .status(404)
        .send({ message: 'Передан несуществующий _id карточки' });
    }
    return res
      .status(202)
      .send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res
        .status(400)
        .send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
    }
    return res
      .status(500)
      .send({ message: `Ошибка обработки запроса: ${err}` });
  });
