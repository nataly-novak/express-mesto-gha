const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken

const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ExistingUserError = require('../errors/ExistingUserError');

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user != null) { res.send(user); }
      throw new NotFoundError('Пользователь не найден');
    }).catch((err) => {
      if (err.name === 'CastError') { throw new NotFoundError('Пользователь не найден'); }
    }).catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user != null) { res.send(user); }
      return res.status(404).send({ message: 'Пользователь не найден' });
    }).catch((err) => {
      if (err.name === 'CastError') { throw new NotFoundError('Пользователь не найден'); }
    }).catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(
      users.map((user) => (user)),
    )).catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (user != null) { res.send(user); }
      throw new NotFoundError('Пользователь не найден');
    }).catch((err) => {
      if (err.name === 'ValidationError') { throw new ValidationError('Переданы некорректные данные в методы редактирования профиля'); }
    }).catch(next);
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (user != null) { res.send(user); }
      throw new NotFoundError('Пользователь не найден');
    }).catch((err) => {
      if (err.name === 'ValidationError') { throw new ValidationError('Переданы некорректные данные в методы редактирования аватара пользователя'); }
      throw err;
    }).catch(next);
};

module.exports.createUser = (req, res, next) => bcrypt.hash(req.body.password, 10)
  .then((hash) => User.create({
    email: req.body.email,
    password: hash,
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  }))
  .then((user) => res.send({
    email: user.email,
    name: user.name,
    about: user.about,
    avatar: user.avatar,
  }))
  .catch((err) => {
    if (err.name === 'ValidationError') { throw new ValidationError('Переданы некорректные данные в методы создания пользователя'); }
    if (err.name === 'MongoServerError') { throw new ExistingUserError('Такой пользователь уже существует'); }
    throw err;
  })
  .catch(next);

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      res.send({
        token: jwt.sign(
          { _id: user._id },
          'some-secret-key',
          { expiresIn: '7d' },
        ),
      });
    })
    .catch(next);
};
