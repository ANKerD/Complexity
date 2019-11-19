const moment = require("moment");
const { Router } = require("express");
const httpStatusCode = require("../constants/http-status-code.json");
const supportedLangs = JSON.parse(process.env.SUPPORTED_LANGS);

let nextId = 1;
const getId = () => nextId++;

const submissions = {};

const saveSummission = sub => {
  submissions[sub.id] = sub;
  console.log(submissions);
};

const states = Object.freeze({
  QUEUED: "Queued",
  CE: "Compilation Error",
  TLE: "Time Limit Exceded",
  WA: "Wrong Answer",
  RTE: "Runtime Error",
  MLE: "Memory Limit Exceded",
  AC: "Accepted",
  RUNNING: "RUNNING"
});

const create = (req, res) => {
  const { lang, problem } = req.params;

  if (!supportedLangs.includes(lang)) {
    res.status(httpStatusCode.BAD_REQUEST).end();
  }
  const { code } = req.body;
  const author = req.player.nick;
  const id = getId();
  const createdAt = moment.now();
  const newSubmission = {
    lang,
    problem,
    author,
    code,
    id,
    createdAt,
    state: "QUEUED"
  };

  Object.keys(states).forEach(state => {
    if (code.includes(state)) {
      newSubmission.state = state;
    }
  });
  saveSummission(newSubmission);

  // por enquanto o codigo nao sai do server
  const { code: _, ...responseSubmission } = newSubmission;
  res.status(httpStatusCode.OK).json(responseSubmission);
};

const getById = (req, res) => {
  const { id } = req.params;
  if (!submissions.hasOwnProperty(id)) {
    return res.status(httpStatusCode.NOT_FOUND).end();
  }
  const { code: _, ...submission } = submissions[id];
  res.json(submission);
};

// é interessante implementar paginaçao aqui
const getAll = (req, res) => {
  const responseSubmissions = [];
  Object.values(submissions).forEach(submission => {
    const { code: _, ...responseSubmission } = submission;
    responseSubmissions.push(responseSubmission);
  });
  res.json(responseSubmissions);
};

const routes = () => {
  const router = Router();

  // TODO: router.use(authentication) e remover esse ap.use aqui
  router.use((req, res, next) => {
    req.player = {
      email: "hand@spinner.com",
      nick: "hand",
      password: "spinner"
    };
    next();
  });
  router.post("/:problem/:lang/", create);

  router.get("/", getAll);
  router.get("/:id", getById);

  return router;
};

module.exports = routes;
