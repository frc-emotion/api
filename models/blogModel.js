const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
	title: { type: String, required: true },
	author: { type: String, required: true },
	date: { type: Number, required: true },
	body: { type: String, required: true },
	tags: { type: Array, required: false },
	public: { type: Boolean, required: true },
});

module.exports = global.blogDb.model("Blog", blogSchema);
