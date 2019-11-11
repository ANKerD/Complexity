const {Schema, model} = require("mongoose");
const validator = require("validator");
const ObjectId = Schema.Types.ObjectId;
const Player = require("../models/Player");

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
        minlength: 1,
        maxlength: 250
    }
},{
    timestamps: true,
    collection: "Comments"
});

CommentSchema.methods.show = async function(){
    const player = await Player.findOne({_id:this._authorId});
    const nick = player.toProfile().profile.nick;
    const body = this.body;
    const id = this._id;

    return {id,nick,body};
}

const Comment = model('Comment', CommentSchema);
module.exports = {
    Comment,
    CommentSchema
}
