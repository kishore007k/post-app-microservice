const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Query = require("./Models/Query");
const { default: axios } = require("axios");

dotenv.config();

const MONGO_DB_URL = process.env.MONGO_DB;

const app = express();

// const handleGetEvents = async () => {
// 	try {
// 		const res = await axios.get("http://eventbus-srv:4005/events");
// 		for (let event of res.data) {
// 			console.log("Processing event:", event.type);
// 			handleEvent(event.type, event.data);
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

const handleEvent = async (event, data) => {
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

		case "commentModerated":
			const { comment: new_comment, status: newStatus, postId: postIdId } = data;
			const commentToUpdate = await Query.findOneAndUpdate(
				{ postId: postIdId, "comments.comment": new_comment },
				{ $set: { "comments.$.status": newStatus } }
			);
			commentToUpdate.save();
			break;

		default:
			break;
	}
};

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

app.get("/posts/:id", async (req, res) => {
	const { id } = req.params;
	const post = await Query.findOne({ postId: id });
	return res.status(200).send(post);
});

app.get("/posts/:id/comment", async (req, res) => {
	try {
		const { id } = req.params;

		const comments = await Query.find({ postId: id });

		return res.status(200).send(comments[0].comments);
	} catch (error) {
		return res.status(500).send(error);
	}
});

app.post("/events", (req, res) => {
	console.log(`${req.body.event} event received`);

	const { event, data } = req.body;

	handleEvent(event, data);

	return res.status(200).send({ message: "Event received successfully" });
});

mongoose.connect(MONGO_DB_URL, (err) => {
	if (!err) {
		console.log("Connected to MongoDB");
		app.listen(4002, () => {
			console.log(`Query Service is running on http://query-srv:4002/`);
			// handleGetEvents();
		});
	}
});
