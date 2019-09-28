const { Router } = require('express');
const players = require('../models/Player');
const jwt = require('jsonwebtoken');
const config = require('../config');
const httpStatusCode = require('../constants/http-status-code.json');

const user_exists_msg = "User already exists";

const signup = async (req, res) =>{
	const { email, nick } = req.body.player;

	p = await players.find({$or : [{email:email}, {nick:nick}]}).exec()
	
	if(p.length == 0){
		players.create(req.body.player)
			.then(({id}) => {
				console.log("Id from player [" + req.body.player.nick + "]: " + id)
				const token = jwt.sign({ id: id}, config.jwt_secret,{expiresIn: '1h'});
				return res.send({token})
			})
			.catch(err => {
				console.error(err);
				return res.status(httpStatusCode.BAD_REQUEST).send({error: "Registration failed"});
			})
	} else {
		res.status(httpStatusCode.BAD_REQUEST).send({ error: user_exists_msg}).end();
	}
}

const routes = () => {
    const router = Router();

    router.post('/signup', signup);
    // router.post('/login', login);
    router.all('*', (req, res) => res.status(404).send('Not Found'));
  
    return router;
}
  
module.exports = routes;