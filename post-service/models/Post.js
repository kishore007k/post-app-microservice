const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		comments: [
			{
				content: {
					type: String,
					required: true,
				},
				status: {
					type: String,
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Post", postSchema) || Post;
