const Problem = require("../models/Problem");
const httpStatusCode = require('../constants/http-status-code.json');

module.exports.registerProblem = async (req, res) =>{
    const {title} = req.body.problem;
    p = await Problem.findOne({title});
    if(p === null){
        try{
            const problem = new Problem(req.body.problem);
            await problem.save();
            return res.status(httpStatusCode.CREATED).send(problem);
        }catch(error){
            return res.status(httpStatusCode.BAD_REQUEST).send({error: "error registering problem"});
        }
    }else{
        res.status(httpStatusCode.BAD_REQUEST).send({error: "Problem with that name already exists"});
    }
}

module.exports.findProblems = async (req, res) =>{
    //SO SE LEVA EM CONSIDERAÇÃO O LEVEL CASO A SEJA UMA PESQUISA POR LEVEL
    const level = req.params.level;
    let problems;

    if(level === undefined){
        problems = await Problem.find();
    }else{
        problems = await Problem.find({level});
    }

    return res.status(httpStatusCode.OK).send({
        results: problems,
        message: `${problems.length} results found`
    });
}   

module.exports.findProblemsBySubstring = async (req, res) => {
    const pattern = req.params.pattern;
    const result = await Problem.find({"title": {$regex: `(?i).*${pattern}.*`}});

    res.status(httpStatusCode.OK).send({
        results: result,
        message: `${result.length} results found`
    });
}
