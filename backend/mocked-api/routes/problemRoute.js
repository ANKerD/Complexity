const { Router } = require("express");

const problemController = require("../controllers/problem_controller");
const auth = require("../middleware/auth");

const router = Router();

const routes = () =>{
    router.post('/', auth, problemController.register);
    router.get('/:_id', problemController.findById);
    router.get('/', problemController.find);

    return router;
}

module.exports = routes;