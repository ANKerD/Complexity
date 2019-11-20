const { Router } = require("express");

const problemController = require("../controllers/problem_controller");
const auth = require("../middleware/auth");

const router = Router();

const routes = () => {
    router.get('/', problemController.find);
    router.post('/', auth, problemController.register);

    router.get('/:_id', problemController.findById);
    router.post('/:_id', auth, problemController.submit);

    return router;
}

module.exports = routes;