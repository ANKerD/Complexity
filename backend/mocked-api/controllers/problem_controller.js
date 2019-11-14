const Problem = require("../models/Problem");
const httpStatusCode = require('../constants/http-status-code.json');
const sort = require('../util/sort');
const _ = require('lodash');

module.exports.registerProblem = async (req, res) => {
    try {
        const problem = new Problem(req.body.problem);
        console.log(problem);
        await problem.save();
        return res.status(httpStatusCode.CREATED).send(problem);
        } catch(error) {
            console.log(error);
            return res.status(httpStatusCode.BAD_REQUEST).send({error: "error registering problem"});
        }
}

module.exports.findProblemById = async (req, res) => {
    const _id = req.params._id;
    try {
        const problem = await Problem.findOne({_id}); 
        console.log(problem);   
        return res.status(httpStatusCode.OK).send({problem});
    }catch(err) {
        return res.status(httpStatusCode.NOT_FOUND).send({error: "Problem Not Found"});
    }
}

module.exports.findOthers = async (req, res) => {
    const level = req.query.level;
    const pattern = req.query.pattern;
    const order = req.query.order;
    const type_question = req.query.type_question;
    let problems = await Problem.find();
    if (pattern !== undefined) {
        problems = await Problem.find({"title": {$regex: `(?i).*${pattern}.*`}});
    }
    if (level !== undefined) {
        problems = _.filter(problems, p => p.level === parseInt(level));
    }
    if (type_question !== undefined) {
        problems = _.filter(problems, p => p.type_question.includes(type_question));
    }
    if (order !== undefined) {
        if (order == "invert")
            problems = sort(true, problems);
        else 
            sort(false, problems);
    }
    return res.status(httpStatusCode.OK).send({
        results: problems,
        message: `${problems.length} results found`
    });
} 


