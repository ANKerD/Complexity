const { Router } = require('express');

const blogController = require('../controllers/blog_controller')
const auth = require("../middleware/auth");

const router = Router();

const routes = () => {
    router.get("/:blogId", auth, blogController.showBlog);
    router.post("/create", auth, blogController.createBlog);
    router.post("/:blogId/like", auth, blogController.like);
    router.post("/:blogId/dislike", auth, blogController.dislike);
    router.post("/:blogId/comment", auth, blogController.addComment);
    router.delete("/:blogId/comment/:commentId", auth, blogController.removeComment);
    router.get("/sort/time", auth, blogController.sortByTime);
    router.get("/sort/likes", auth, blogController.sortByLikes);
    router.get("/search/title/:pattern", auth, blogController.searchTitle);
    router.get("/search/body/:pattern", auth, blogController.searchBody);
    router.get("/search/author/:authorId", auth, blogController.searchAuthor);

  return router;
};

module.exports = routes