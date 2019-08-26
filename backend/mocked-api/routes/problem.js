const { Router } = require('express');

const problems = [
  {
    id: '42a',
    level: 'red',
    descr: 'Dado dois números, imprima a soma deles', // description
    author: {
      name: 'Hand',
      email: 'spinner@hand.tfg'
    },
    samples: [
      {
        input: '1 2\n',
        output: '3\n',
      },
      {
        input: '16 18\n',
        output: '34\n',
      }
    ]
  },
  {
    id: '42b',
    level: 'plus-ultra',
    descr: 'Dado dois números, imprima o produto deles', // description
    author: {
      name: 'Hand',
      email: 'spinner@hand.tfg'
    },
    samples: [
      {
        input: '1 2\n',
        output: '2\n',
      },
      {
        input: '0 18\n',
        output: '0\n',
      }
    ]
  }
];


const getAll = (req, res) => {
  const problemsSummary = problems.map(element => {
    let elem = Object.assign({}, element);
    delete elem.samples;
    return elem;
  });
  res.json(problemsSummary);
}

const getById = (req, res) => {
  const problem = problems.find(prob => prob.id == req.params.id);
  if (problem) {
    return res.json(problem);
  } else {
    return res.status(404).end();
  }
}

const routes = () => {
  const router = Router();
  router.get('/', getAll);
  router.get('/:id', getById);

  return router;
};

module.exports = routes;