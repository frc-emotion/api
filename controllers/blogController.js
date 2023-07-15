const asyncHandler = require("express-async-handler");
const Blog = require("../models/blogModel");

const createPost = asyncHandler(async (req, res) => {
	const { title, author, date, body, tags, public } = req.body;

	if (!title || !author || !date || !body || !public) {
		res.status(400).json({ message: "Please fill in all fields" });
	}

	const post = await Blog.create({
		title,
		author,
		date,
		body,
		tags,
		public,
	});

	if (post) {
		res.status(201).json({
			_id: post._id,
			title: post.title,
			author: post.author,
			date: post.date,
			body: post.body,
			tags: post.tags,
			public: post.public,
		});
	} else {
		res.status(400).json({ message: "Invalid blog post data" });
	}
});

const getPosts = asyncHandler(async (req, res) => {
	const posts = await Blog.find(req.query);
	res.json(posts);
});

const getPostById = asyncHandler(async (req, res) => {
	const post = await Blog.findById(req.params.id);
	if (post) {
		res.json(post);
	} else {
		res.status(404).json({ message: "Blog post not found" });
	}
});

const deletePost = asyncHandler(async (req, res) => {
	const post = await Blog.findById(req.params.id);

	if (!post) {
		res.status(400);
		throw new Error("Requested blog post not found");
	}

	await Blog.findByIdAndRemove(req.params.id);

	res.status(200).json({
		message: "Blog post deleted",
		id: req.params.id,
	});
});

module.exports = {
	createPost,
	getPosts,
	getPostById,
	deletePost,
};
