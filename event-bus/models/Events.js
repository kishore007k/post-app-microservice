const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
	{
		event: String,
		data: Object,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema) || Event;
