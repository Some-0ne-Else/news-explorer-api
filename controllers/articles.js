const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .populate('owner')
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Статья не найдена');
      }
      if (article.owner._id.toString() === req.user._id) {
        return Article.findByIdAndRemove(req.params.id).then((a) =>
          res.send({ data: a }),
        );
      }
      throw new ForbiddenError('Статья принадлежит другому пользователю');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан некорректный идентификатор');
      }
      next(err);
    })
    .catch(next);
};

module.exports.addArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  const userId = req.user._id;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: userId,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          `Переданы некорректные данные: ${err.message}`,
        );
      }
    })
    .catch(next);
};
