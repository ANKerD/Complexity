const { Schema, model } = require('mongoose');

const PlayerSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email can't be blank"],
        match: [/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/, 'is invalid']
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
    }
}, {
    timestamps: true,
    collection: "Players"
});

module.exports = model('Players', PlayerSchema )