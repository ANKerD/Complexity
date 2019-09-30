const { Schema, model } = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken')
const config = require('../config');

const PlayerSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email can't be blank"],
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email address'})
            }
        }
    },
    nick: {
        type: String,
        unique: true,
        required: [true, "Nick can't be blank"],
        match: [/[-a-zA-Z_0-9]/, 'is invalid']
    },
    password: {
        type: String,
        required: [true, "Password can't be blank"],
        select: false,
        minLength: 5,
        match: [/^[a-zA-Z0-9]+$/, 'is invalid']
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    level: {type: Number, default: 0},
    xp: {type: Number, default: 0},
    coins: {type: Number, default: 0},
    problemsSubmitted: {type: Array},
    problemsSolved: {type: Array},
    submissions: {type: Number, default: 0},
    friends: {type: Array},
    teams: {type: Array},
    contests: {type: Array},
    name: {type: String},
    age: {type: Number},
    nationality: {type: String},
    institution: {type: String},
}, {
    timestamps: true,
    collection: "Players"
});

PlayerSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the player
    const player = this;
    const token = jwt.sign({_id: player._id}, config.jwt_secret);
    player.tokens = player.tokens.concat({token});
    await player.save();
    return token;
}

PlayerSchema.statics.findByEmailAndPassword = async (email, password) => {
    // Search for a player by email and password.
    const player = await Player.findOne({ email } ).select('+password');
    console.log(player);
    if (!player) {
        throw new Error({ error: 'Invalid login credentials' });
    }
    const isPasswordMatch = password == player.password;
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' });
    }
    return player;
}

PlayerSchema.statics.findByNickAndPassword = async (nick, password) => {
    // Search for a player by nick and password.
    const player = await Player.findOne({ nick } ).select('+password');
    console.log(player);
    if (!player) {
        throw new Error({ error: 'Invalid login credentials' });
    }
    const isPasswordMatch = password == player.password;
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
        nick: this.nick,
        level: this.level,
        problemsSubmitted: this.problemsSubmitted,
        problemsSolved: this.problemsSolved,
        submissions: this.submissions,
        teams: this.teams,
        contests: this.contests
        }
    };
  };


const Player = model('Player', PlayerSchema)
module.exports = Player