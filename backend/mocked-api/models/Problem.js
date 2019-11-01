const { Schema, model } = require('mongoose');

const ProblemSchema = new Schema({

    title: {
        type: "String",
        required: true
    },
    level: {
        type: Number, min: 1, max: 10,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        nick: {type: String},
        email: {type: String}
    },
    photo: {type: String},
    samples: [
        {
            "input": {type: String, required: true},
            "output": {type: String, required: true}
        }
    ]

}, {
    timestamps: true,
    collection: "Problems"
});

const Problem = model('Problem', ProblemSchema);
module.exports = Problem;