const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createUser,
} = require('../controllers/users');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(www\.)?[0-9a-zA-Z-]{1,256}\.[0-9a-zA-Z]{1,10}\/?([0-9a-zA-Z\-._~:/?#[\]@!$&'()*+,;=]{1,})?#?/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

module.exports = router;
