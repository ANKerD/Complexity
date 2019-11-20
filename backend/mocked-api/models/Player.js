<<<<<<< HEAD
const { Schema, model } = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken')
const config = require('../config');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch');
const apiAdress = config.apiAdress;
=======
const { Schema, model } = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
>>>>>>> origin/develop

const PlayerSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email can't be blank"],
      validate: value => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: "Invalid Email address" });
        }
      }
    },
    nick: {
      type: String,
      unique: true,
      required: [true, "Nick can't be blank"],
      match: [/[-a-zA-Z_0-9]/, "is invalid"]
    },
    password: {
      type: String,
      required: [true, "Password can't be blank"],
      select: false,
      minlength: 5
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    level: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    problemsSubmitted: { type: Array },
    problemsSolved: { type: Array },
    submissions: { type: Number, default: 0 },
    friends: { type: Array },
    teams: { type: Array },
    contests: { type: Array },
    name: { type: String },
    age: { type: Number },
    nationality: { type: String },
    institution: { type: String },
    photo: { type: String }
  },
  {
    timestamps: true,
    collection: "Players"
  }
);

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const checkSubmission = async function(player, submissionId, ms) {
    const init = {
        method : "GET"
    };

    try{
        console.log("Getting submission state...")
        const response = await fetch(apiAdress + `/submissions/${submissionId}`, init);
        if (response.ok){
            const data = await response.json();
            console.log(data)

            if (data.state != "FAILED" && data.result === ""){
                await wait(ms);
                await checkSubmission(player, submissionId, ms);
            }

            if (data.result === "AC") {
                player.addSolvedProblem(submissionId);
                player.save()
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const asyncMapShow = async function(list) {
    return await Promise.all(list.map(async elem => {return elem.show()}))
}

PlayerSchema.methods.addSolvedProblem = function(submissionId){
    this.problemsSolved = this.problemsSolved.concat(submissionId);
}

PlayerSchema.methods.addSubmittedProblem =  async function(submissionId) {
    this.problemsSubmitted =this.problemsSubmitted.concat(submissionId);
    checkSubmission(this, submissionId, 500);
};

PlayerSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const player = this
    if (player.isModified('password')) {
        player.password = await bcrypt.hash(player.password, 8)
    }
    next()
});


PlayerSchema.methods.generateNewPassword = async function() {
  const player = this;
  const newPassword = crypto.randomBytes(20).toString("hex");
  player.password = newPassword;
  player.save();
  return newPassword;
};

PlayerSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the player
  const player = this;
  const token = jwt.sign({ _id: player._id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
  player.tokens = player.tokens.concat({ token });
  await player.save();
  return token;
};

PlayerSchema.statics.findByEmailAndPassword = async (email, password) => {
  // Search for a player by email and password.
  const player = await Player.findOne({ email }).select("+password");
  console.log(player);
  if (!player) {
    throw new Error({ error: "Invalid login credentials" });
  }
  const isPasswordMatch = await bcrypt.compare(password, player.password);
  if (!isPasswordMatch) {
    throw new Error({ error: "Invalid login credentials" });
  }
  return player;
};

PlayerSchema.statics.findByNickAndPassword = async (nick, password) => {
<<<<<<< HEAD
    // Search for a player by nick and password.
    const player = await Player.findOne({ nick } ).select('+password');
    console.log(player);
    if (!player) {
        throw new Error({ error: 'Invalid login credentials' });
    }
    const isPasswordMatch = await bcrypt.compare(password, player.password);
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' });
    }
    return player;
}

PlayerSchema.methods.toProfile = function(){
    return {
      profile: {
        name: this.name,
        age: this.age,
        nationality: this.nationality,
        institution: this.institution,
        photo: this.photo,
        nick: this.nick,
        level: this.level,
        problemsSubmitted: asyncMapShow(this.problemsSubmitted),
        problemsSolved: asyncMapShow(this.problemsSolved),
        submissions: this.submissions,
        teams: this.teams,
        contests: this.contests,
        friends: this.friends
        }
    };
=======
  // Search for a player by nick and password.
  const player = await Player.findOne({ nick }).select("+password");
  console.log(player);
  if (!player) {
    throw new Error({ error: "Invalid login credentials" });
  }
  const isPasswordMatch = await bcrypt.compare(password, player.password);
  if (!isPasswordMatch) {
    throw new Error({ error: "Invalid login credentials" });
  }
  return player;
>>>>>>> origin/develop
};

PlayerSchema.methods.toProfile = function() {
  return {
    profile: {
      name: this.name,
      age: this.age,
      nationality: this.nationality,
      institution: this.institution,
      photo: this.photo,
      nick: this.nick,
      level: this.level,
      coins: this.coins,
      problemsSubmitted: this.problemsSubmitted,
      problemsSolved: this.problemsSolved,
      submissions: this.submissions,
      teams: this.teams,
      contests: this.contests,
      friends: this.friends
    }
  };
};

const Player = model("Player", PlayerSchema);
module.exports = Player;
