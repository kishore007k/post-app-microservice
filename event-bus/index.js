const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();

const corsOptions = {
	origin: "*",
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
	res.send("Welcome to the Event Bus Service");
});

app.post("/event", (req, res) => {
	const { event, data } = req.body;

	const eventData = {
		event,
		data,
	};

	// Post Service
	axios.post("http://localhost:4000/events", eventData);
	// Comment Service
	axios.post("http://localhost:4001/events", eventData);
	// Query Service
	axios.post("http://localhost:4003/events", eventData);

	return res.status(201).send("Event received");
});

app.listen(4002, () => {
	console.log(`Event Bus Server is running on http://localhost:${4002}`);
});
