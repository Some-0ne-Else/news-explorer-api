const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { getUserInfo } = require('../controllers/users');

router.get(
  '/',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
  }),
  auth,
  getUserInfo,
);

module.exports = router;
