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

module.exports.findProblemsByLevel = async (req, res) =>{
    const level = req.params.level;
    try{
        const problems = await Problem.find({level});
    
        return res.status(httpStatusCode.OK).send({
            results: problems,
            message: `${problems.length} results found`
        });
    }catch(err){
        return res.status(httpStatusCode.NOT_FOUND).send({error: "Not Found"});
    }
}   

module.exports.findProblems = async (req, res) =>{
    const problems = await Problem.find();
    
    return res.status(httpStatusCode.OK).send({
        results: problems,
        message: `${problems.length} results found`
    });
}

module.exports.findProblemsInOrder = async (req, res) =>{
    const order = req.params.order;
    const problems = await Problem.find();
    if(order === "down"){
        problems.sort(function(a,b) {
            return a.level > b.level ? -1 : a.level < b.level ? 1 : 0;
        });    
    }else{
        problems.sort(function(a,b) {
            return a.level < b.level ? -1 : a.level > b.level ? 1 : 0;
        });
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
