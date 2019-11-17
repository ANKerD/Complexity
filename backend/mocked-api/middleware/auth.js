const jwt = require('jsonwebtoken');
const Player = require('../models/Player');
const config = require('../config');

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, config.jwt_secret)
        const player = await Player.findOne({ _id: data._id, 'tokens.token': token }).select('+password')
        if (!player) {
            throw new Error("Errow while authorization token")
        }
        req.player = player;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }
}
module.exports = auth;