const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

const { JWT_SECRET = 'yandex-praktikum-key' } = process.env;

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Ошибка в переданных данных');
      }
      next(err);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then(() =>
        res.send({
          name,
          about,
          avatar,
          email,
        }),
      )
      .catch((err) => {
        if (err.code === 11000) {
          throw new ConflictError(
            `Пользователь с таким email уже зарегистрирован: ${err.message}`,
          );
        }
        if (err.name === 'ValidationError') {
          throw new BadRequestError(
            `Переданы некорректные данные: ${err.message}`,
          );
        }
        throw new Error();
      })
      .catch(next);
  });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};
