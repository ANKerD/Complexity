const { Router } = require("express");

const problemController = require("../controllers/problem_controller");

const router = Router();

const routes = () =>{
    router.post('/registerproblem', problemController.registerProblem);
    router.get('/findproblems/:level', problemController.findProblemsByLevel);
    router.get('/findproblems', problemController.findProblems);
    router.get('/findproblemsubstring/:pattern', problemController.findProblemsBySubstring);
    router.get('/findproblemsorder/:order', problemController.findProblemsInOrder);

    return router;
}

module.exports = routes;