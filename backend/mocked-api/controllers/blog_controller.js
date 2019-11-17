const _ = require('lodash');
const { Router } = require('express');
const Player = require('../models/Player');
const Blog = require("../models/Blog");
const auth = require("../middleware/auth");
const httpStatusCode = require('../constants/http-status-code.json');

const router = Router();

const blog_not_found_msg = "Blog not found";

module.exports.showBlog = async (req,res) => {
    const _id = req.params.blogId;
    const blog = await Blog.findOne({_id});

    if (!blog) {
        return res.status(httpStatusCode.BAD_REQUEST).send({error: blog_not_found_msg});
    }

    res.status(httpStatusCode.OK).send(await blog.show());
};

module.exports.createBlog = async (req,res) => {
    const {title,body} = req.body.blog;
    const _authorId = req.player._id;

    const newBlog = {title,body,_authorId};
    const blog = new Blog(newBlog);
    await blog.save();

    res.status(httpStatusCode.OK).send({msg: "Blog created", blogId: blog._id});
};

module.exports.like = async (req, res) => {
    const id = req.params.blogId;
    const playerId = req.player._id;
    const blog = await Blog.findOne({_id:id});

    if (!blog){
        res.status(httpStatusCode.BAD_REQUEST).send(blog_not_found_msg);
    }

    try{
        await blog.like(playerId);
    } catch(error){
        res.status(httpStatusCode.BAD_REQUEST).send({error:error});
    }

    res.status(httpStatusCode.OK).send({msg:"Like added"})
};

module.exports.dislike = async (req,res) => {
    const id = req.params.blogId;
    const playerId = req.player._id;
    const blog = await Blog.findOne({_id:id});

    if (!blog){
        res.status(httpStatusCode.BAD_REQUEST).send(blog_not_found_msg);
    }
    try{
        await blog.dislike(playerId);
    } catch(error){
        res.status(httpStatusCode.BAD_REQUEST).send({error:error});
    }

    res.status(httpStatusCode.OK).send({msg:"Dislike added"})

};

module.exports.addComment = async (req,res) => {
    const playerId = req.player._id;
    const id = req.params.blogId;
    const blog = await Blog.findOne({_id:id});

    const comment = req.body.comment;

    if (!blog){
        res.status(httpStatusCode.BAD_REQUEST).send(blog_not_found_msg);
    }

    try{
        await blog.addComment(playerId,comment);
        res.status(httpStatusCode.OK).send({msg:"Comment added"});
    } catch (error) {
        res.status(httpStatusCode.BAD_REQUEST).send({error});
    }
};

module.exports.removeComment = async (req,res) => {
    const playerId = req.player._id;
    const blogId = req.params.blogId;
    const blog = await Blog.findOne({_id:blogId});
    const commentId = req.params.commentId;

    if (!blog){
        res.status(httpStatusCode.BAD_REQUEST).send(blog_not_found_msg);
    }

    try{
        await blog.removeComment(commentId,playerId);
        res.status(httpStatusCode.OK).send({msg:"Comment removed"});
    } catch (error) {
        res.status(httpStatusCode.BAD_REQUEST).send({error});
    }
};

module.exports.sortByTime =  async(req,res) => {
    const result = await Blog.sortByCreationTime();

    res.status(httpStatusCode.OK).send({query:result});
};

module.exports.sortByLikes = async(req,res) => {
    const result = await Blog.sortByLikes();

    res.status(httpStatusCode.OK).send({query:result});
};

module.exports.searchTitle = async(req,res) => {
    const pattern = req.params.pattern;
    const result = await Blog.searchTitle(pattern);

    res.status(httpStatusCode.OK).send({query:result});
};

module.exports.searchBody = async(req,res) => {
    const pattern = req.params.pattern;
    const result = await Blog.searchBody(pattern);

    res.status(httpStatusCode.OK).send({query:result});
};

module.exports.searchAuthor = async(req,res) => {
    const authorNick = req.params.nick;
    const result = await Blog.findByAuthor(authorNick);

    res.status(httpStatusCode.OK).send({query:result});
};

