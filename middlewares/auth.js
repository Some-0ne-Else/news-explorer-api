const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const { JWT_SECRET = 'yandex-praktikum-key' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  let payload;
  let token;
  if (authorization !== undefined) {
    if (!authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Необходима авторизация');
    }
    token = authorization.replace('Bearer ', '');
  }

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  req.user = payload;
  next();
};
