const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const secret = NODE_ENV === 'production' ? JWT_SECRET : 'some-dev-secret';

const AuthError = require('../errors/auth-err');

module.exports.auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new AuthError('Ошибка авторизации');
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch (e) {
    throw new AuthError('Ошибка авторизации');
  }
  /* const { authorization } = req.headers;
  if (!authorization) {
    throw new AuthError('Доступ запрещён');
  }
  const token = authorization.replace('Bearer ', '');
  if (!token && token !== 'Bearer ') {
    throw new AuthError('Ошибка авторизации');
  }
  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch (e) {
    return res.status(403).send({ message: 'Доступ запрещён 2' });
  }
   */
  req.user = payload;
  return next();
};
