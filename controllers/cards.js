const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const WrongUserError = require('../errors/WrongUserError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') { next(new ValidationError('Переданы некорректные данные в методы создания карточки')); }
      next(err);
    });
};
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card === null) {
        throw (new NotFoundError('Карточка не найдена'));
      }
      return card;
    })
    .then((card) => {
      if (String(card.owner._id) !== String(req.user._id)) {
        throw (new WrongUserError('Нет Доступа'));
      }
      return card;
    })
    .then((card) => Card.findByIdAndRemove(card._id))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') { next(new NotFoundError('Карточка не найдена')); }
      next(err);
    });
};
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card != null) { res.send(card); }
      throw (new NotFoundError('Карточка не найдена'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { next(new ValidationError('Переданы некорректные данные для постановки лайка')); }
      if (err.name === 'CastError') { next(new NotFoundError('Карточка не найдена')); }
      next(err);
    });
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card != null) { res.send(card); }
      throw new NotFoundError('Карточка не найдена');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { next(new ValidationError('Переданы некорректные данные для снятия лайка')); }
      if (err.name === 'CastError') { next(new NotFoundError('Карточка не найдена')); }
      next(err);
    });
};
