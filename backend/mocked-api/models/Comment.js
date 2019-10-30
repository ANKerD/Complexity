const {Schema, model} = require("mongoose");
const validator = require("validator");
const ObjectId = Schema.Types.ObjectId;

const CommentSchema = new Schema({
    _authorId: {
        type: ObjectId,
        ref: "Player",
        required: [true, "A comment must have an author"]
    },
    body: {
        type: String,
        required: [true, "A comment must have a body"],
        trim: true,
        minLength: 1,
        maxLength: 250
    }
},{
    timestamps: true,
    collection: "Comments"
});

const Comment = model('Comment', CommentSchema);
module.exports = {
    Comment,
    CommentSchema
}
