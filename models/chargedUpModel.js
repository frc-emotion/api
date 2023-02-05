const mongoose = require("mongoose");

const chargedUpSchema = mongoose.Schema(
	{
		/* user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		}, */
		competition: { type: String, required: true },
		matchNumber: { type: Number, required: true },
		teamNumber: { type: Number, required: true },
		teamName: { type: String, required: true },
		RPEarned: Array,
		totalRP: Number,
		autoPeriod: Object,
		teleopPeriod: Object,
		linkScore: Number,
		autoDock: Boolean,
		autoEngage: Boolean,
		teleopDock: Boolean,
		teleopEngage: Boolean,
		parked: Boolean,
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

module.exports = global.gamesDb.model("ChargedUp", chargedUpSchema);
