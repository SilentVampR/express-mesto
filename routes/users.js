const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getMe,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getMe);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
