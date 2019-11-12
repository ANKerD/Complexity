const { Router } = require("express");

const problemController = require("../controllers/problem_controller");
const auth = require("../middleware/auth");

const router = Router();

const routes = () =>{
    router.post('/', auth, problemController.registerProblem);
    router.get('/:_id', problemController.findProblemById);
    router.get('/', problemController.findOthers);

    return router;
}

module.exports = routes;