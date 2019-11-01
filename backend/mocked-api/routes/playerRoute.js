const { Router } = require('express');

const playerController = require('../controllers/player_controller')
const auth = require("../middleware/auth");

const router = Router();


const routes = () => {
  router.post('/forgetpassword', playerController.forgetPassword);
  router.post('/signup', playerController.signup);
  router.post('/login', playerController.login);
  router.get('/me', auth, playerController.myProfile);
  router.post('/me', auth, playerController.updateProfile);
  router.post('/me/logout', auth, playerController.logout);
  router.post('/me/logoutall', auth, playerController.logoutall);
  router.post('/me/image', auth, playerController.imageUpload);
  router.post('/me/password', auth, playerController.changePassword);
  router.get('/:nick', playerController.profile);
  router.post('/friend', auth, playerController.addFriend);
  router.delete('/friend', auth, playerController.removeFriend);
  router.get('/search/:pattern', auth, playerController.searchPlayerBySubstring);
  router.all('*', (req, res) => res.status(404).send('Not Found'));

  return router;
}

module.exports = routes;
