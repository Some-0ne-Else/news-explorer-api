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
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      // eslint-disable-next-line no-useless-escape
      link: Joi.string()
        .required()
        .pattern(/https?:\/\/[a-zA-Z0-9\/.\-]+\.+[a-zA-Z0-9\/.-]+#?/),
      // eslint-disable-next-line no-useless-escape
      image: Joi.string()
        .required()
        .pattern(/https?:\/\/[a-zA-Z0-9\/.\-]+\.+[a-zA-Z0-9\/.-]+#?/),
    }),
  }),
  auth,
  addArticle,
);

module.exports = router;
