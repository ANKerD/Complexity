const { Router } = require('express');
const Player = require('../models/Player');
const jwt = require('jsonwebtoken');
const config = require('../config');
const httpStatusCode = require('../constants/http-status-code.json');

const user_exists_msg = "User already exists";
const user_not_found_msg = "User not found";
const invalid_field_msg = "Please provide a valid username and password.";


const signup = async (req, res) =>{
	const { email, nick } = req.body.player;

	const p = await Player.find({$or : [{email:email}, {nick:nick}]}).exec();
	
	if(p.length == 0){
		Player.create(req.body.player)
			.then(({id}) => {
				console.log("Id from player [" + req.body.player.nick + "]: " + id);
				const token = jwt.sign({ id: id}, config.jwt_secret,{expiresIn: '1h'});
				return res.send({token});
			})
			.catch(err => {
				console.error(err);
				return res.status(httpStatusCode.BAD_REQUEST).send({msg: "Registration failed", err});
			})
	} else {
		res.status(httpStatusCode.BAD_REQUEST).send({ error: user_exists_msg}).end();
	}
}

const login = async (req, res) => {
	const { email, nick, password } = req.body.player;
	var player = undefined;
	if(email && nick){
		return res.status(400).send({error: "Send nick or email"});
	}
	
	if(email){
		player = await Player.findOne({ email }).select('+password');
	} else if (nick) {
		player = await Player.findOne({ nick }).select('+password');
	}

  if(!player)
    return res.status(400).send({ error: user_not_found_msg});

  if(player.password != password)
    return res.status(400).send({ error: invalid_field_msg});

  const token = jwt.sign({ id: player.id}, config.jwt_secret,
    {expiresIn: '1h'}
  );

  return res.send({token});
}

const profile = async (req, res) => {
	const nick = req.params.nick;
	const player = await Player.findOne({ nick });
	
	if(!player)
		return res.status(400).send({ error: user_not_found_msg});
	
	res.send(player.toProfile());
}

const myProfile = async (req, res) => {
	// TODO: check if requester matches authentiated user
	const nick = req.params.nick;
	const player = await Player.findOne({ nick });
	
	if(!player)
		return res.status(400).send({ error: user_not_found_msg});
	
	res.send(player.toProfile());
}

const routes = () => {
    const router = Router();

    router.post('/signup', signup);
		router.post('/login', login);
		router.get('/:nick/me', myProfile);
		router.get('/:nick', profile);
    router.all('*', (req, res) => res.status(404).send('Not Found'));
  
    return router;
}
  
module.exports = routes;