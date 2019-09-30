const { Router } = require('express');
const Player = require('../models/Player');
const auth = require("../middleware/auth");
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
		try {
			const player = new Player(req.body.player);
			await player.save();
			console.log("Id from player [" + req.body.player.nick + "]: " + player._id);
			const token = await player.generateAuthToken()
			return res.status(201).send({ player, token })
		} catch (error) {
			console.error(error);
			return res.status(httpStatusCode.BAD_REQUEST).send({msg: "Registration failed", error});
		}
	} else {
		res.status(httpStatusCode.BAD_REQUEST).send({ error: user_exists_msg}).end();
	}
}

const login = async (req, res) => {
	const { email, nick, password } = req.body.player;
	var player = undefined;
	
	if(email && nick){
		console.log("Send nick or email");
		return res.status(400).send({error: "Send nick or email"});
	}
	
	try {
		if(email){
			player = await Player.findByEmailAndPassword(email, password);
		} else if (nick) {
			player = await Player.findByNickAndPassword(nick, password);
		}

		if(!player)
			return res.status(400).send({ error: user_not_found_msg});
		const token = await player.generateAuthToken();
		return res.send({token});
	} catch (error) {
        res.status(400).send({error})
    }
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
		router.get('/:nick/me', auth, myProfile);
		router.get('/:nick', profile);
    router.all('*', (req, res) => res.status(404).send('Not Found'));
  
    return router;
}
  
module.exports = routes;