const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getArticles,
  addArticle,
  deleteArticle,
} = require('../controllers/articles');

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
  getArticles,
);

router.delete(
  '/:id',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
    params: Joi.object().keys({
      id: Joi.string().hex().max(24),
    }),
  }),
  auth,
  deleteArticle,
);

router.post(
  '/',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        // eslint-disable-next-line no-useless-escape
        .pattern(/https?:\/\/[a-zA-Z0-9\/.\-]+\.+[a-zA-Z0-9\/.-]+#?/),
    }),
  }),
  auth,
  addArticle,
);

module.exports = router;
