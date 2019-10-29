const { Schema, model } = require('mongoose');

const ProblemSchema = new Schema({

    level: {
        type: String,
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
            input: {type: String},
            output: {type: String}
        },
        {
            input: {type: String},
            output: {type: String}
        }
    ]
}, {
    timestamps: true,
    collection: "Problems"
});

const Problem = model('Problem', ProblemSchema);
module.exports = Problem;