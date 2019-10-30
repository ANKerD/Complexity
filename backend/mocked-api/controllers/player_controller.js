const _ = require('lodash');
const { Router } = require('express');
const Player = require('../models/Player');

const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const config = require('../config');
const httpStatusCode = require('../constants/http-status-code.json');
const mailer = require('../mailer/mailer');
const Email = require('email-templates');
const bcrypt = require('bcryptjs');

const user_exists_msg = "User already exists";
const user_not_found_msg = "User not found";
const invalid_field_msg = "Please provide a valid username and password.";
const invalid_password_msg = "Please provide a valid password";

const router = Router();

const emailT = new Email({
	transport: mailer.transporter,
	send: true,
	preview: false,
  });



module.exports.signup = async (req, res) =>{
	// TODO: add default express handler for this error and for a generic, unknown error
	// if (req.body.player) return res.status(400).send({error: "Send nick or email"});

	const { email, nick } = req.body.player;
	console.log(req.body.player);

	const p = await Player.find({$or : [{email:email}, {nick:nick}]}).exec();

	if(p.length == 0){
		try {
			const player = new Player(req.body.player);
			await player.save();
			console.log("Id from player [" + req.body.player.nick + "]: " + player._id);
			const token = await player.generateAuthToken()
			emailT.send(mailer.welcome(email, nick));
			return res.status(201).send({ player, token })
		} catch (error) {
			console.error(error);
			return res.status(httpStatusCode.BAD_REQUEST).send({msg: "Registration failed", error});
		}
	} else {
		res.status(httpStatusCode.BAD_REQUEST).send({ error: user_exists_msg}).end();
	}
}

module.exports.login = async (req, res) => {
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

module.exports.profile = async (req, res) => {
	const nick = req.params.nick;
	const player = await Player.findOne({ nick });

	if(!player)
		return res.status(400).send({ error: user_not_found_msg});

	res.send(player.toProfile());
}

module.exports.myProfile = async (req, res) => {
	// TODO: check if requester matches authentiated user
	const player = req.player;

	if(!player)
		return res.status(400).send({ error: user_not_found_msg});

	res.send(player.toProfile());
}

module.exports.logout = async (req, res) => {
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

module.exports.logoutall = async(req, res) => {
	try {
        req.player.tokens = []
        await req.player.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports.imageUpload = async (req, res) => {
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

module.exports.addFriend = async (req, res) => {
	const player = req.player;
	const friend = req.body.friend;

	player.friends.push(friend);
	player.friends = _.uniq(player.friends);

	await player.save();
	res.status(200).send({
		message: 'Added friend with success'
	});
}

module.exports.removeFriend = async (req, res) => {
	const player = req.player;
	const friend = req.body.friend;

	player.friends = _.filter(player.friends, frnd => frnd != friend);

	await player.save();
	res.status(200).send({
		message: 'Removed friend with success'
	});
}

module.exports.updateProfile = async (req, res) => {

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

module.exports.searchPlayerBySubstring = async (req,res) => {
	const pattern = req.params.pattern;
	const result = await Player.find({"nick": {$regex: `.*${pattern}.*`}});

	res.status(200).send({
		results: result.map(elem => elem.nick),
		message: `${result.length} results found`
	});
};

/*
* At least 5 characters
* Alphanumerics & Underscore
*/
const validatePassword = (pass) => {
	return Boolean(/^[\w]{5,}$/.exec(pass));
};

module.exports.changePassword = async (req,res) =>{
	const player = req.player;
	const current_password = req.body.current_password;
	const new_password = req.body.new_password;

	const isPasswordMatch = await bcrypt.compare(current_password, player.password);
	console.log("Is Password Match: " + isPasswordMatch);
	const isEquals = await bcrypt.compare(new_password, player.password);
	console.log("Is Equals: " + isEquals);
	let status = 200;
	let response = {};

	if (isPasswordMatch && validatePassword(new_password) && !isEquals){
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


module.exports.forgetPassword = async (req, res) =>{
	try {
		const {email} = req.body.player;
		const player = await Player.findOne({ email });
		if(!player)
			return res.status(404).send({user_not_found_msg});
		const {nick} = player;
		const new_password =  await player.generateNewPassword();
		emailT.send(mailer.forgetPass(email, nick, new_password));
		return res.status(200).send({message: 'new password sent to email'});
	} catch(e) {
		return res.status(500).send(e).end();
	}
	
}
