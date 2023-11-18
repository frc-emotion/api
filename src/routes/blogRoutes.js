const express = require("express");
const router = express.Router();
const {
	createPost,
	getPosts,
	getPostById,
	deletePost,
} = require("../controllers/blogController");
// const { protect, adminProtect } = require("../middleware/authMiddleware");

router.route("/").post(createPost).get(getPosts);
router.route("/:id").get(getPostById).delete(deletePost);

module.exports = router;