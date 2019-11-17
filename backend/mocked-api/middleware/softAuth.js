const jwt = require('jsonwebtoken');
const Player = require('../models/Player');
const config = require('../config');

const auth2 = async(req, res, next) => {
	try{
    	const token = req.header('Authorization').replace('Bearer ', '')
    	const data = jwt.verify(token, config.jwt_secret)
    	const player = await Player.findOne({ _id: data._id, 'tokens.token': token }).select('+password')
    	req.player = player;
		req.token = token;
		next();
	}catch(err){
		next();
	}
}
module.exports = auth2;