const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Query = require("./Models/Query");

dotenv.config();

const MONGO_DB_URL = process.env.MONGO_DB;

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.send("Welcome to the Event Bus Service");
});

app.get("/posts", async (req, res) => {
	try {
		const posts = await Query.find();
		return res.status(200).send(posts);
	} catch (error) {
		return res.status(500).send(error);
	}
});

app.post("/posts", (req, res) => {
	try {
		const { postId, title, content } = req.body;
		const newPost = new Query({
			postId,
			title,
			content,
		});
		newPost.save();
		return res.status(200).send({ message: "Post added successfully" });
	} catch (error) {
		return res.status(500).send(error);
	}
});

app.post("/posts/:id/comment", async (req, res) => {
	try {
		const { comment, status } = req.body;
		const { id } = req.params;
		const newComment = await Query.findOneAndUpdate(
			{ postId: id },
			{ $push: { comments: { comment, status } } },
			{ new: true }
		);
		newComment.save();
		return res.status(200).send({ message: "Comment added successfully" });
	} catch (error) {
		return res.status(500).send(error);
	}
});

app.post("/events", async (req, res) => {
	const { event, data } = req.body;

	switch (event) {
		case "commentCreated":
			const { comment, status, postId } = data;
			const newComment = await Query.findOneAndUpdate(
				{ postId },
				{ $push: { comments: { comment, status } } }
			);
			newComment.save();
			break;

		case "postCreated":
			const { postId: id, title, content } = data;
			const newPost = new Query({
				postId: id,
				title,
				content,
			});
			newPost.save();
			break;

		default:
			break;
	}

	return res.status(200).send({ message: "Event received successfully" });
});

mongoose.connect(MONGO_DB_URL, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log("Connected to MongoDB");
		app.listen(4003, () => {
			console.log(`Query Service is running on http://localhost:${4003}`);
		});
	}
});
