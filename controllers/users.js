const User = require('../models/user');

const showUser = (user) => ({
  name: user.name,
  about: user.about,
  avatar: user.avatar,
  _id: user._id,
});

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(showUser(user)))
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Переданы некорректные данные в методы создания пользователя' }); }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(showUser(user)))
    .catch((err) => {
      if (err.name === 'CastError') { return res.status(400).send({ message: 'Пользователь не найден' }); }
      if (err.name === 'TypeError') { return res.status(404).send({ message: 'Пользователь не найден' }); }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(
      users.map((user) => (showUser(user))),
    ))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => res.send(showUser(user)))
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Переданы некорректные данные в методы редактирования профиля' }); }
      if (err.name === 'CastError') { return res.status(404).send({ message: 'Пользователь не найден' }); }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => res.send(showUser(user)))
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Переданы некорректные данные в методы редактирования аватара пользователя' }); }
      if (err.name === 'CastError') { return res.status(404).send({ message: 'Пользователь не найден' }); }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};
