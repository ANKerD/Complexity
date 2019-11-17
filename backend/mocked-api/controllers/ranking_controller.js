const httpStatusCode = require("../constants/http-status-code.json");
const Player = require('../models/Player');
const _ = require("lodash");

module.exports.listRanking = async (req, res) => {
    let {param, order} = req.query;
    let ranking = await Player.find();
    let profiles = _.forEach(ranking, (p) => {return p.toProfile()});
    if(order != "asc")
        order = "desc";
    if(param == "solved")
        profiles = _.orderBy(profiles, (user)=> {return _.size(user.problemsSolved)}, order);
    else
        profiles = _.orderBy(profiles, ["xp"], order);
    return res.status(httpStatusCode.OK).send({
        results: profiles
    });
}