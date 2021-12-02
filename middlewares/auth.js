const jwt = require('jsonwebtoken');

const JWT_SECRET = 'some_secret';

module.exports.auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    return res.status(403).send({ message: 'Доступ запрещён 1' });
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return res.status(403).send({ message: 'Доступ запрещён 3' });
  }
  /* const { authorization } = req.headers;
  if (!authorization) {
    return res.status(403).send({ message: 'Доступ запрещён 1' });
  }
  const token = authorization.replace('Bearer ', '');
  if (!token && token !== 'Bearer ') {
    return res.status(403).send({ message: 'Доступ запрещён 2' });
  }
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return res.status(403).send({ message: 'Доступ запрещён 3' });
  }
   */
  req.user = payload;
  return next();
};
