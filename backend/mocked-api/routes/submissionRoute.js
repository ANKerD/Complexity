const { Router } = require("express");

const submissionController = require("../controllers/submission_controller");
const auth = require("../middleware/auth");

const router = Router();

const routes = () => {
    router.get('/:_id', auth, submissionController.checkSubmission);

    return router;
};

module.exports = routes;
