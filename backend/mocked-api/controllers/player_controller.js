const { Router } = require('express');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const players = require('../models/Player');
const jwt = require('jsonwebtoken');
const config = require('../config');
const httpStatusCode = require('../constants/http-status-code.json');

const user_exists_msg = "User already exists";
const user_not_found_msg = "User not found";
const invalid_field_msg = "Please provide a valid username and password.";

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
	const { email, nick } = req.body.player;

	const p = await players.find({$or : [{email:email}, {nick:nick}]}).exec();
	
	if(p.length == 0){
		players.create(req.body.player)
			.then(({id}) => {
				console.log("Id from player [" + req.body.player.nick + "]: " + id);
				const token = jwt.sign({ id: id}, config.jwt_secret,{expiresIn: '1h'});
				return res.send({token});
			})
			.catch(err => {
				console.error(err);
				return res.status(httpStatusCode.BAD_REQUEST).send({error: "Registration failed"});
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
		player = await players.findOne({ email }).select('+password');
	} else if (nick) {
		player = await players.findOne({ nick }).select('+password');
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
	const player = await players.findOne({ nick });
	
	if(!player)
		return res.status(400).send({ error: user_not_found_msg});
	
	res.send(player.toProfile());
}

const myProfile = async (req, res) => {
	// TODO: check if requester matches authentiated user
	const nick = req.params.nick;
	const player = await players.findOne({ nick });
	
	if(!player)
		return res.status(400).send({ error: user_not_found_msg});
	
	res.send(player.toProfile());
}

const imageUpload = async (req, res) => {
	console.log('uploading...');
	const { nick } = req.params;
	const player = await players.findOne({ nick });
	
	if(!player)
		return res.status(400).send({ error: user_not_found_msg});
	
	const { image } = req.files;
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

const routes = () => {
    router.post('/signup', signup);
	router.post('/login', login);
	router.post('/:nick/image', imageUpload);
	router.get('/:nick/me', myProfile);
	router.get('/:nick', profile);
    router.all('*', (req, res) => res.status(404).send('Not Found'));
  
    return router;
}
  
module.exports = routes;