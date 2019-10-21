const _ = require('lodash');
const { Router } = require('express');
const Player = require('../models/Player');
const Blog = require("../models/Blog");
const auth = require("../middleware/auth");
const cloudinary = require('cloudinary').v2;
const config = require('../config');

const router = Router();

const blog_not_found_msg = "Blog not found";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret
});


const showBlog = async (req,res) => {
    const _id = req.params.blogId;
    const blog = await Blog.findOne({_id});

    if (!blog) {
        return res.status(400).send({error: blog_not_found_msg});
    }

    res.status(200).send(await blog.show());
};

const createBlog = async (req,res) => {
    const {title,body} = req.body.blog;
    const _authorId = req.player._id;

    const newBlog = {title,body,_authorId};
    const blog = new Blog(newBlog);
    await blog.save();

    res.status(200).send({msg: "Blog created"});
};

const like = async (req, res) => {
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

const dislike = async (req,res) => {
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

const addComment = async (req,res) => {
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

const removeComment = async (req,res) => {
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

const sortByTime =  async(req,res) => {
    const result = await Blog.sortByCreationTime();

    res.status(200).send(result);
};

const sortByLikes = async(req,res) => {
    const result = await Blog.sortByLikes();

    res.status(200).send({result});
};

const searchTitle = async(req,res) => {
    const pattern = req.params.pattern;
    const result = await Blog.searchTitle(pattern);

    res.status(200).send({query:result});
};

const searchBody = async(req,res) => {
    const pattern = req.params.pattern;
    const result = await Blog.searchTitle(pattern);

    res.status(200).send({query:result});
};

const searchAuthor = async(req,res) => {
    const authorId = req.params.authorId;
    const result = await Blog.findByAuthorID(authorId);

    res.status(200).send({query:result});
};


const routes = () => {
    router.get("/:blogId", auth, showBlog);
    router.post("/create", auth, createBlog);
    router.post("/:blogId/like", auth, like);
    router.post("/:blogId/dislike", auth, dislike);
    router.post("/:blogId/comment", auth, addComment);
    router.delete("/:blogId/comment/:commentId", auth, removeComment);
    router.get("/sort/time", auth, sortByTime);
    router.get("/sort/likes", auth, sortByLikes);
    router.get("/search/title/:pattern", auth, searchTitle);
    router.get("/search/body/:pattern", auth, searchBody);
    router.get("/search/author/:authorId", auth, searchAuthor);

  return router;
};

module.exports = routes;
