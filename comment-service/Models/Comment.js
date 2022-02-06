const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	comment: {
		type: String,
		required: true,
	},
	postId: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
		default: "pending",
	},
});

module.exports = mongoose.model("Comment", commentSchema) || Comment;
