const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new ForbiddenError('Доступ запрещён');
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    throw new ForbiddenError('Доступ запрещён');
  }
  /* const { authorization } = req.headers;
  if (!authorization) {
    throw new ForbiddenError('Доступ запрещён');
  }
  const token = authorization.replace('Bearer ', '');
  if (!token && token !== 'Bearer ') {
    throw new ForbiddenError('Доступ запрещён');
  }
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return res.status(403).send({ message: 'Доступ запрещён 2' });
  }
   */
  req.user = payload;
  return next();
};
