const Problem = require("../models/Problem");
const httpStatusCode = require('../constants/http-status-code.json');

module.exports.registerProblem = async (req, res) =>{
    try{
        const problem = new Problem(req.body.problem);
        await problem.save();
        return res.status(httpStatusCode.CREATED).send(problem);
        }catch(error){
            console.log(error);
            return res.status(httpStatusCode.BAD_REQUEST).send({error: "error registering problem"});
        }
}

module.exports.findProblemById = async (req, res) =>{
    const _id = req.params._id;
    try{
        const problems = await Problem.findOne({_id});    
        return res.status(httpStatusCode.OK).send({
            results: problems,
            message: `${problems.length} results found`
        });
    }catch(err){
        return res.status(httpStatusCode.NOT_FOUND).send({error: "Problem Not Found"});
    }
}

module.exports.findOthers = async (req, res) =>{
    const level = req.query.level;
    const pattern = req.query.pattern;
    const order = req.query.order;
    const type_question = req.query.type_question;
    let problems;
    if(level !== undefined){
        problems = await Problem.find({level});
    }
    else if(type_question !== undefined){
        problems = await Problem.find({type_question});
    }
    else if(pattern !== undefined){
        problems = await Problem.find({"title": {$regex: `(?i).*${pattern}.*`}});
    }
    else if(order !== undefined){
        problems = await findProblemsInOrder(order);
    }
    else{
        problems = await Problem.find();
    }
    return res.status(httpStatusCode.OK).send({
        results: problems,
        message: `${problems.length} results found`
    });

} 
   
async function findProblemsInOrder(order){
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
    return problems;
}

