const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const auth = require('../middlewares/auth');

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
    avatar: Joi.string().required().regex(/https?:\/\/(www\.)?[0-9a-zA-Z-]{1,256}\.[0-9a-zA-Z]{1,10}\/?([0-9a-zA-Z\-._~:/?#[\]@!$&'()*+,;=]{1,})?#?/),
  }),
}), updateAvatar);

module.exports = router;
