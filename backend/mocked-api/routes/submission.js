const { Router } = require('express');
const moment = require('moment');

let nextId = 1;
const getId = () => nextId++;

const create = (req, res) => {
  const { lang, problem} = req.params;
  const { code } = req.body;
  const author = req.player.nick;
  const id = getId();
  const currentTime = moment.now();
  console.log(lang, problem, author, code, id, currentTime);
  res.end();
};

const routes = () => {
  const router = Router();

  router.use((req, res, next) => {
    req.player = {
      email: 'hand@spinner.com',
      nick: 'hand',
      password: 'spinner'
    };
    next();
  })
  // TODO: router.use(authentication)
  router.post('/:problem/:lang/', create);
  // router.get('/:id', getById);

  return router;
};

module.exports = routes;