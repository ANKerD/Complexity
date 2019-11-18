const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const config = require("../config");
const httpStatusCode = require("../constants/http-status-code.json");
const _ = require("lodash");
const fetch = require('node-fetch');
const apiAdress = config.apiAdress;

module.exports.checkSubmission = async (req,res) => {
  const {submissionId} = req.body;
  const init = {
    method : "GET"
  };

  try{
    const response = await fetch(apiAdress + `/submissions/${submissionId}`, init);

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
