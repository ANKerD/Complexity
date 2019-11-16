const { Router } = require("express");
ranking_controller = require("../controllers/ranking_controller");

const router = Router();

const routes = ()=>{

    router.get('/:type', ranking_controller.listRanking);
    return router;
}

module.exports = routes;