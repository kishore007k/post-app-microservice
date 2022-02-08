const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.send("Welcome to the Moderator Service");
});

app.post("/events", (req, res) => {
	console.log(`${req.body.event} event received`);

	if ((req.body.event = "commentCreated")) {
		const status = req.body.data.comment.includes("spam")
			? "rejected"
			: "approved";

		const updatedData = {
			event: "commentModerated",
			data: { ...req.body.data, status },
		};

		// Comment Service
		axios.post("http://localhost:4001/events", updatedData);

		// Query Service
		axios.post("http://localhost:4003/events", updatedData);

		return res.status(200).send({ message: "Comment moderated successfully" });
	}

	return res.status(201).send("Event received");
});

app.listen(4004, () => {
	console.log(`Moderator Service listening on http://localhost:4004`);
});
