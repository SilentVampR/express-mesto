const Card = require('../models/card');

const RequestError = require('../errors/request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getErrors = (data) => Object.values(data.errors).map((error) => error.message);

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .populate(['owner', 'likes'])
    .then((card) => res
      .status(201)
      .send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(`Не все поля заполены корректно: ${getErrors(err)}`));
      }
      next(err);
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res
      .status(200)
      .send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      const ownerId = card.owner._id.toString();
      if (ownerId !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав для выполнения данного действия');
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then((cardToDelete) => res
          .status(202)
          .send({ data: cardToDelete }))
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new RequestError('Переданы некорректные данные для удаления карточки'));
          }
          next(err);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Переданы некорректные данные для удаления карточки'));
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      return res
        .status(202)
        .send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Переданы некорректные данные для постановки/снятии лайка'));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      return res
        .status(202)
        .send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Переданы некорректные данные для постановки/снятии лайка'));
      }
      next(err);
    });
};
