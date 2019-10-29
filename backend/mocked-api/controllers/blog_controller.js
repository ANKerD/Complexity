const _ = require('lodash');
const { Router } = require('express');
const Player = require('../models/Player');
const Blog = require("../models/Blog");
const auth = require("../middleware/auth");

const router = Router();

const blog_not_found_msg = "Blog not found";

module.exports.showBlog = async (req,res) => {
    const _id = req.params.blogId;
    const blog = await Blog.findOne({_id});

    if (!blog) {
        return res.status(400).send({error: blog_not_found_msg});
    }

    res.status(200).send(await blog.show());
};

module.exports.createBlog = async (req,res) => {
    const {title,body} = req.body.blog;
    const _authorId = req.player._id;

    const newBlog = {title,body,_authorId};
    const blog = new Blog(newBlog);
    await blog.save();

    res.status(200).send({msg: "Blog created"});
};

module.exports.like = async (req, res) => {
    const id = req.params.blogId;
    const playerId = req.player._id;
    const blog = await Blog.findOne({_id:id});

    if (!blog){
        res.status(400).send(blog_not_found_msg);
    }

    try{
        await blog.like(playerId);
    } catch(error){
        res.status(400).send({error:error});
    }

    res.status(200).send({msg:"Like added"})
};

module.exports.dislike = async (req,res) => {
    const id = req.params.blogId;
    const playerId = req.player._id;
    const blog = await Blog.findOne({_id:id});

    if (!blog){
        res.status(400).send(blog_not_found_msg);
    }

    try{
        await blog.dislike(playerId);
    } catch(error){
        res.status(400).send({error:error});
    }

    res.status(200).send({msg:"Dislike added"})

};

module.exports.addComment = async (req,res) => {
    const playerId = req.player._id;
    const id = req.params.blogId;
    const blog = await Blog.findOne({_id:id});

    const comment = req.body.comment;

    if (!blog){
        res.status(400).send(blog_not_found_msg);
    }

    try{
        await blog.addComment(playerId,comment);
        res.status(200).send({msg:"Comment added"});
    } catch (error) {
        res.status(400).send({error});
    }
};

module.exports.removeComment = async (req,res) => {
    const playerId = req.player._id;
    const blogId = req.params.blogId;
    const blog = await Blog.findOne({_id:blogId});
    const commentId = req.params.commentId;

    if (!blog){
        res.status(400).send(blog_not_found_msg);
    }

    try{
        await blog.removeComment(commentId,playerId);
        res.status(200).send({msg:"Comment removed"});
    } catch (error) {
        res.status(400).send({error});
    }
};

module.exports.sortByTime =  async(req,res) => {
    const result = await Blog.sortByCreationTime();

    res.status(200).send(result);
};

module.exports.sortByLikes = async(req,res) => {
    const result = await Blog.sortByLikes();

    res.status(200).send({result});
};

module.exports.searchTitle = async(req,res) => {
    const pattern = req.params.pattern;
    const result = await Blog.searchTitle(pattern);

    res.status(200).send({query:result});
};

module.exports.searchBody = async(req,res) => {
    const pattern = req.params.pattern;
    const result = await Blog.searchBody(pattern);

    res.status(200).send({query:result});
};

module.exports.searchAuthor = async(req,res) => {
    const authorId = req.params.authorId;
    const result = await Blog.findByAuthorID(authorId);

    res.status(200).send({query:result});
};

