const mongoose = require("mongoose");

const blogPostSchema = mongoose.Schema({
	title: { type: String, required: true },
	author: { type: mongoose.SchemaTypes.ObjectId, required: true },
	date: { type: Number, required: true },
	body: { type: String, required: true },
	tags: [String],
	public: { type: Boolean, required: true },
});

module.exports = global.postsDb.model("BlogPost", blogPostSchema);