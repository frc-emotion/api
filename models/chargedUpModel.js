const mongoose = require("mongoose");

const chargedUpSchema = mongoose.Schema(
	{
		editHistory: Array,
		competition: { type: String, required: true },
		matchNumber: { type: Number, required: true },
		teamNumber: { type: Number, required: true },
		teamName: { type: String, required: true },
		RPEarned: Array,
		totalRP: Number,
		autoPeriod: Object,
		teleopPeriod: Object,
		coneRate: Number,
		cubeRate: Number,
		linkScore: Number,
		autoDock: Boolean,
		autoEngage: Boolean,
		teleopDock: Boolean,
		teleopEngage: Boolean,
		parked: Boolean,
		isDefensive: Boolean,
		chargeStation: Number,
		didBreak: Boolean,
		penaltyCount: Number,
		score: { type: Number, required: true },
		won: { type: Boolean, required: true },
		tied: { type: Boolean, required: true },
		comments: String,
	},
	{
		timestamps: true,
	}
);

module.exports = global.scoutingDb.model("ChargedUp", chargedUpSchema);