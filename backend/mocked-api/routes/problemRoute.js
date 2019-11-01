const { Router } = require("express");

const problemController = require("../controllers/problem_controller");

const router = Router();

const routes = () =>{
    router.post('/registerproblem', problemController.registerProblem);
    router.get('/findproblems/:level', problemController.findProblems);
    router.get('/findproblems', problemController.findProblems);
    router.get('/findproblemsubstring/:pattern', problemController.findProblemsBySubstring);

    return router;
}

module.exports = routes;