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

app.get("/", (req, res) => {
	res.send("Welcome to the Comments Service");
});

app.post("/post/:id/comment", (req, res) => {
	try {
		const { comment } = req.body;
		const { id } = req.params;

		const newComment = new Comment({
			comment,
			postId: id,
			status: "pending",
		});

		axios.post("http://localhost:4002/event", {
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

app.get("/post/:id/comment", async (req, res) => {
	try {
		const { id } = req.params;

		const comments = await Comment.find({ postId: id });

		return res.status(200).send(comments);
	} catch (error) {
		return res.status(500).send(error);
	}
});

app.post("/events", (req, res) => {
	console.log(`${req.body.event} event received`);
	return res.status(200).send(`${req.body.event} event received`);
});

mongoose.connect(MONGO_DB_URL, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log("Connected to MongoDB");
		app.listen(4001, () => {
			console.log(`Comment Service is running on http://localhost:${4001}`);
		});
	}
});
