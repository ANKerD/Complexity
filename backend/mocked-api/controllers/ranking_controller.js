const httpStatusCode = require("../constants/http-status-code.json");
const Player = require('../models/Player');
const _ = require("lodash");

module.exports.listRanking = async (req, res) => {
    const type = req.params.type;
    let ranking = await Player.find();
    if(type == "problemssolved")
        ranking = _.orderBy(ranking, (user)=> {return _.size(user.problemsSolved)}, "desc");
    else
        ranking = _.orderBy(ranking, ["xp"], "desc");
    return res.status(httpStatusCode.OK).send({
        results: ranking
    });
}