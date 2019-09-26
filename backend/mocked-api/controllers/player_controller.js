const { Router } = require('express');
const players = require('../models/Player');
const jwt = require('jsonwebtoken');
const config = require('../config');
const httpStatusCode = require('../constants/http-status-code.json');

const user_exists_msg = "User already exists";

const signup = (req, res) =>{
	const { email, nick } = req.body.player;

	players.find({$or : [{email:email}, {nick:nick}]})
		.exec(function(err, result) {
			if(err) console.error(err);
			if (result) {
				return res.status(httpStatusCode.BAD_REQUEST).send({ error: user_exists_msg}).end();
			} else {
				players.create(req.body.player)
				.then(({id}) => {
					console.log(id)
					const token = jwt.sign({ id: id}, config.jwt_secret,{expiresIn: '1h'});
					return res.send({token})
				})
				.catch(err => {
					console.error(err);
					return res.status(httpStatusCode.BAD_REQUEST).send({error: "Registration failed"});
				})
			}
		})
}

const routes = () => {
    const router = Router();

    router.post('/signup', signup);
    // router.post('/login', login);
    router.all('*', (req, res) => res.status(404).send('Not Found'));
  
    return router;
}
  
module.exports = routes;