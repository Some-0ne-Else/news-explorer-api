const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message:
    'Too many requests from this IP, please try again in one minute',
});

module.exports = { limiter };
