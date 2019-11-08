const { Router } = require("express");

const problemController = require("../controllers/problem_controller");

const router = Router();

const routes = () =>{
    router.post('/register', problemController.registerProblem);
    router.get('/find/:_id', problemController.findProblemById);
    router.get('/find/:level?:pattern?:order?', problemController.findOthers);

    return router;
}

module.exports = routes;