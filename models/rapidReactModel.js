const mongoose = require("mongoose");

const rapidReactSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		competition: { type: String, required: true },
		matchNumber: { type: Number, required: true },
		teamNumber: { type: Number, required: true },
		teamName: String,
		tarmac: Boolean,
		autoLower: Number,
		autoUpper: Number,
		teleopLower: Number,
		teleopUpper: Number,
		cycleTime: String,
		mainShots: String,
		climbScore: Number,
		defensive: Boolean,
		humanShot: Boolean,
		rankingPoints: Array,
		score: { type: Number, required: true },
		won: { type: Boolean, required: true },
		comments: String,
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("RapidReact", rapidReactSchema);
