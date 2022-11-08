const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const urlRegex = require('../constants/urlRegex');

const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.post('/', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(urlRegex),
  }),
}), createCard);
router.get('/', auth, getCards);
router.delete('/:cardId', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteCard);
router.put('/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), likeCard);
router.delete('/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), dislikeCard);

module.exports = router;
