const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const auth = require('../middlewares/auth');

const {
  getUser, updateUser, updateAvatar, getUserMe,
} = require('../controllers/users');

router.get('/me', auth, getUserMe);
router.get('/:userId', auth, getUser);
router.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required(),
  }),
}), updateUser);
router.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    link: Joi.string().required().uri(),
  }),
}), updateAvatar);

module.exports = router;
