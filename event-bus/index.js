const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Events = require("./models/Events");

dotenv.config();

const app = express();

const MONGO_DB_URL = process.env.MONGO_DB;

const corsOptions = {
	origin: "*",
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
	res.send("Welcome to the Event Bus Service");
});

app.post("/event", (req, res) => {
	console.log(`${req.body.event} event received`);

	try {
		const { event, data } = req.body;

		const eventData = {
			event,
			data,
		};

		const events = new Events(eventData);

		events.save();

		// Post Service
		axios.post("http://clusterip-posts-srv:4000/events", eventData);

		// Comment Service
		axios.post("http://comments-srv:4001/events", eventData);

		// Query Service
		axios.post("http://query-srv:4002/events", eventData);

		// Moderator Service
		axios.post("http://moderator-srv:4003/events", eventData);

		return res.status(201).send("Event received");
	} catch (error) {
		return res.status(500).send(error);
	}
});

mongoose.connect(MONGO_DB_URL, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log("Connected to MongoDB");
		app.listen(4005, () => {
			console.log(`Event Bus Server is running on http://eventbus-srv:${4005}`);
		});
	}
});
