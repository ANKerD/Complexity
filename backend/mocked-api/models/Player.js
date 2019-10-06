const { Schema, model } = require('mongoose');

const PlayerSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email can't be blank"]
        // match: [/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/, 'is invalid']
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
        match: [/^[a-zA-Z0-9]+$/, 'is invalid']
    },
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
    photo: {type: String}
}, {
    timestamps: true,
    collection: "Players"
});

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
        problemsSubmitted: this.problemsSubmitted,
        problemsSolved: this.problemsSolved,
        submissions: this.submissions,
        teams: this.teams,
        contests: this.contests
        }
    };
  };

module.exports = model('Player', PlayerSchema )