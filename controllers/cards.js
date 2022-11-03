const Card = require('../models/card');

const showUser = (user) => ({
  name: user.name,
  about: user.about,
  avatar: user.avatar,
  _id: user._id,
});

const showCard = (card) => ({
  likes: card.likes,
  _id: card._id,
  name: card.name,
  link: card.link,
  owner: showUser(card.owner),
  createrAt: card.createdAt,
});

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(showCard(card)))
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Переданы некорректные данные в методы создания карточки' }); }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(
      cards.map((card) => showCard(card)),
    ))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send(showCard(card)))
    .catch((err) => {
      if (err.name === 'CastError') { return res.status(400).send({ message: 'Карточка не найдена' }); }
      if (err.name === 'TypeError') { return res.status(404).send({ message: 'Карточка не найдена' }); }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.send(showCard(card)))
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' }); }
      if (err.name === 'CastError') { return res.status(400).send({ message: 'Карточка не найдена' }); }
      if (err.name === 'TypeError') { return res.status(404).send({ message: 'Карточка не найдена' }); }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.send(showCard(card)))
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' }); }
      if (err.name === 'CastError') { return res.status(400).send({ message: 'Карточка не найдена' }); }
      if (err.name === 'TypeError') { return res.status(404).send({ message: 'Карточка не найдена' }); }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};
