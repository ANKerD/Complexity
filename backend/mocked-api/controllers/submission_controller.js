const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const httpStatusCode = require("../constants/http-status-code.json");
const _ = require("lodash");
const fetch = require('node-fetch');

module.exports.checkSubmission = async (req,res) => {
  const submissionId = req.params._id;
  const init = {
    method : "GET"
  };

  try{
    const response = await fetch(process.env.JUDGE_API_ADDRESS + `/submissions/${submissionId}`, init);

    if (response.ok){
      const data = await response.json();
      res.status(httpStatusCode.OK).send(data);
    } else {
      res.status(httpStatusCode.BAD_REQUEST);
    }

  } catch (error) {
    res.status(httpStatusCode.BAD_REQUEST).send({error})
  }
};
