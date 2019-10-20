const _ = require('lodash');
const { Router } = require('express');
const Player = require('../models/Player');
const auth = require("../middleware/auth");
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const config = require('../config');
const httpStatusCode = require('../constants/http-status-code.json');

const user_exists_msg = "User already exists";
const user_not_found_msg = "User not found";
const invalid_field_msg = "Please provide a valid username and password.";
const invalid_password_msg = "Please provide a valid password";

const router = Router();

router.use(fileUpload({
	useTempFiles : true,
	tempFileDir : '/tmp/'
}));

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret
})

const signup = async (req, res) =>{
	// TODO: add default express handler for this error and for a generic, unknown error
	// if (req.body.player) return res.status(400).send({error: "Send nick or email"});

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
	const player = req.player;

	if(!player)
		return res.status(400).send({ error: user_not_found_msg});

	res.send(player.toProfile());
}

const logout = async (req, res) => {
	try {
        req.player.tokens = req.player.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.player.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
}

const logoutall = async(req, res) => {
	try {
        req.player.tokens = []
        await req.player.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
}

const imageUpload = async (req, res) => {
	console.log('uploading...');
	const player = req.player;

	if(!player)
		return res.status(400).send({ error: user_not_found_msg});

	const { image } = req.files;
	if(image == null){
		return res.status(400).send({ error: "Image not found"});
	}
	console.log('image', image);
	try {
		const result = await cloudinary.uploader.upload(image.tempFilePath);
		player.photo = result.url;
		player.save();
		return res.send({url: result.url }).end();
	} catch(e) {
		console.log(e);
		res.status(500).send(e).end();
	}
}

const addFriend = async (req, res) => {
	const player = req.player;
	const friend = req.body.friend;

	player.friends.push(friend);
	player.friends = _.uniq(player.friends);

	await player.save();
	res.status(200).send({
		message: 'Added friend with success'
	});
}

const removeFriend = async (req, res) => {
	const player = req.player;
	const friend = req.body.friend;

	player.friends = _.filter(player.friends, frnd => frnd != friend);

	await player.save();
	res.status(200).send({
		message: 'Removed friend with success'
	});
}

const updateProfile = async (req, res) => {

    const player = req.player;
    const {name,age,nationality,institution} = req.body.updates;

    if (typeof name === "string") {
        player.name = name;
    }

    if (typeof age === "number" && Number.isInteger(age)){
        player.age = age;
    }

    // Adicionar um enum com as nacionalidades possíveis e verificar se a nacionalidade passada é válida.
    if (typeof nationality === "string"){
        player.nationality = nationality;
    }

    if (typeof institution === "string"){
        player.institution = institution;
    }

    player.save();

    res.status(200).send({
    	message: "User successfully updated"
    });
};

const searchPlayerBySubstring = async (req,res) => {
	const pattern = req.params.pattern;
	const result = await Player.find({"nick": {$regex: `.*${pattern}.*`}});

	res.status(200).send({
		results: result.map(elem => elem.nick),
		message: `${result.length} results found`
	});
};

const validatePassword = (pass) => {
	return Boolean(/^[\w]{5,}$/.exec(pass));
};

const changePassword = async (req,res) =>{
	const player = req.player;
	const new_password = req.body.new_password;
	let status = 200;
	let response = {};

	if (validatePassword(new_password) && player.password !== new_password){
		player.password = new_password;
		player.save();

		response.message = "Password successfully updated";
	}
	else {
		status = 400; // Esse status code é mesmo apropriado?
		response.error = invalid_password_msg;
	}

	res.status(status).send(response);
};

const routes = () => {
  	router.post('/signup', signup);
	router.post('/login', login);
	router.get('/me', auth, myProfile);
	router.post('/me', auth, updateProfile);
	router.post('/me/logout', auth, logout);
	router.post('/me/logoutall', auth, logoutall);
	router.post('/me/image', auth, imageUpload);
	router.post('/me/password',auth, changePassword);
	router.get('/:nick', profile);
	router.post('/friend', auth, addFriend);
	router.delete('/friend', auth, removeFriend);
	router.get('/search/:pattern',auth,searchPlayerBySubstring);
  	router.all('*', (req, res) => res.status(404).send('Not Found'));

  return router;
}

module.exports = routes;
