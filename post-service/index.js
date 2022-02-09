const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const Post = require("./models/Post");
const axios = require("axios");

dotEnv.config();
const MONGO_URL = process.env.MONGO_DB;
const app = express();

const corsOptions = {
	origin: "*",
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
	res.send("Welcome to the Post Service");
});

app.get("/post/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.status(200).send(post);
	} catch (error) {
		return res.status(500).send(error);
	}
});

app.post("/post", (req, res) => {
	try {
		const { title, content } = req.body;
		const post = new Post({ title, content });

		// Post request to Event Bus Service
		axios.post("http://eventbus-srv:4005/event", {
			event: "postCreated",
			data: {
				title,
				content,
				postId: post._id,
			},
		});

		post.save();

		return res.status(201).send({ message: "Post created", post });
	} catch (error) {
		console.log({ error });
		return res.status(500).send(error);
	}
});

app.post("/events", (req, res) => {
	console.log(`${req.body.event} event received`);
	return res.status(200).send(`${req.body.event} event received`);
});

mongoose.connect(MONGO_URL, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log("Connected to MongoDB");
		app.listen(4000, () => {
			console.log(`Post Service is running on http://localhost:${4000}`);
		});
	}
});
