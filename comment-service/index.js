const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const Comment = require("./Models/Comment");
const { default: axios } = require("axios");

dotEnv.config();

const MONGO_DB_URL = process.env.MONGO_DB;

const app = express();

const corsOptions = {
	origin: "*",
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.get("/posts/:id/comments", (req, res) => {
	const comments = Comment.find({});
	return res.status(200).send(comments);
});

app.post("/posts/:id/comments", (req, res) => {
	try {
		const { comment } = req.body;
		const { id } = req.params;

		const newComment = new Comment({
			comment,
			postId: id,
			status: "pending",
		});

		// Post Request to Event Bus Service
		axios.post("http://eventbus-srv:4005/events", {
			event: "commentCreated",
			data: {
				comment,
				postId: id,
				status: "pending",
			},
		});

		newComment.save();

		return res.status(200).send({ message: "Comment added successfully" });
	} catch (error) {
		return res.status(500).send(error);
	}
});

app.post("/events", async (req, res) => {
	console.log(`${req.body.event} event received`);

	const { event, data } = req.body;

	if (event === "commentModerated") {
		const { comment: new_comment, status: newStatus, postId: postIdId } = data;

		const commentToUpdate = await Comment.findOneAndUpdate(
			{ postId: postIdId, comment: new_comment },
			{ $set: { "comments.$.status": newStatus } }
		);

		commentToUpdate.save();

		return res.status(200).send(commentToUpdate);
	}

	return res.status(200).send(`${req.body.event} event received`);
});

mongoose.connect(MONGO_DB_URL, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log("Connected to MongoDB");
		app.listen(4001, () => {
			console.log(`Comment Service is running on http://comments-srv:${4001}`);
		});
	}
});
