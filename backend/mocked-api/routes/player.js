const { Router } = require('express');
var jwt = require('jsonwebtoken');

const players = {
  'hand:spinner': {
    email: 'hand@spinner.com',
    nick: 'hand',
    password: 'spinner'
  },
};

const isAuthenticated = credentials  => {
  console.log('credentials', credentials, players);
  return `${credentials.nick}:${credentials.password}` in players;
}

const login = (req, res) => {
  if (!isAuthenticated(req.body.credentials)) {
    return res.status(401).json({
      message: 'Falha na autenticaçao'
    });
  }
  const { nick } = req.body.credentials;
  var token = jwt.sign({ data: { nick } }, 'itsa-secret-baby', {
    expiresIn: req.body.expiration || '1h'
  });

  return res.status(200).json({ token });
}

const signup = (req, res) => {
  const {nick, password} = req.body.player;
  players[`${nick}:${password}`] = req.body.player;
  req.body = {
    credentials: {nick, password}
  }
  return login(req, res);
};

const routes = () => {
  const router = Router();

  router.post('/login', login);
  router.post('/signup', signup);
  router.all('*', (req, res) => res.status(404).send('Not Found'));

  return router;
}

module.exports = routes;