const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const httpStatusCode = require("../constants/http-status-code.json");
const fetch = require('node-fetch');
const _ = require("lodash");
const FormData = require('form-data');
const fs = require('fs');

module.exports.register = async (req, res) => {
  try {
    const problem = new Problem(req.body.problem);
    console.log(problem);
    await problem.save();
    return res.status(httpStatusCode.CREATED).send(problem);
  } catch (error) {
    console.log(error);
    return res
      .status(httpStatusCode.BAD_REQUEST)
      .send({ error: "error registering problem" });
  }
};

module.exports.findById = async (req, res) => {
  const _id = req.params._id;
  try {
    const problem = await Problem.findOne({ _id });
    const result = problem.show();
    console.log(problem);
    return res.status(httpStatusCode.OK).send({result});
  } catch (err) {
    return res
      .status(httpStatusCode.NOT_FOUND)
      .send({ error: "Problem Not Found" });
  }
};

/**
 * @param order String: ['asc', 'desc']
 * @param tags [String]: a json string with the tags to filter
 */
module.exports.find = async (req, res) => {
  const { level, pattern, order } = req.query;
  let { tags } = req.query;
  if (tags) tags = JSON.parse(tags);

  let problems;
  if (pattern) {
    problems = await Problem.find({ title: { $regex: `(?i).*${pattern}.*` } });
  } else {
    problems = await Problem.find();
  }

  if (level !== undefined) {
    problems = _.filter(problems, p => p.level === parseInt(level));
  }

  if (tags) {
    problems = _.filter(problems, p =>
      _.every(tags, tag => p.tags.includes(tag))
    );
  }

  if (order && ["asc", "desc"].includes(order)) {
    problems = _.orderBy(problems, ["level"], order);
  }

  problems = problems.map(elem => elem.show());

  return res.status(httpStatusCode.OK).send({
    results: problems
  });
};

module.exports.submit = async (req,res) => {
  const problemId = req.params._id;
  console.log("Submitting to problem [" + problemId + "]")
  const player = req.player;
  const lang = req.header('Language')
  console.log(lang);
  const address = process.env.JUDGE_API_ADDRESS + `/problems/${problemId}`;

  var form = new FormData();
  console.log(req.files.script.tempFilePath)
  form.append('script', fs.createReadStream(req.files.script.tempFilePath));
  const response = await fetch (address, { method: 'POST', body: form, headers: {"Language": "python"} })
  if (response.ok){
    const data = await response.json();
    player.addSubmittedProblem(data.submission_id)
    player.save()
    // player.save();
    res.status(httpStatusCode.OK).send(data);
  } else {
    res.status(httpStatusCode.BAD_REQUEST);
  }
};
