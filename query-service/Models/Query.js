const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
	{
		postId: {
			type: String,
			required: true,
		},
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
				comment: {
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

module.exports = mongoose.model("Query", querySchema) || Query;
