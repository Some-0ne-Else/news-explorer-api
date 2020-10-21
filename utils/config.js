const {
  PORT = 3000, DB_SERVER = 'localhost', DB_PORT = 27017, DB_NAME = 'api-news-db', JWT_SECRET = 'yandex-praktikum-key',
} = process.env;

module.exports = {
  PORT, DB_SERVER, DB_PORT, DB_NAME, JWT_SECRET,
};
