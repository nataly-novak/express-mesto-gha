const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const auth = require('../middlewares/auth');
const urlRegex = require('../constants/urlRegex');

const {
  getUser, updateUser, updateAvatar, getUserMe, getUsers,
} = require('../controllers/users');

router.get('/', auth, getUsers);
router.get('/me', auth, getUserMe);
router.get('/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUser);
router.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
router.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(urlRegex),
  }),
}), updateAvatar);

module.exports = router;
