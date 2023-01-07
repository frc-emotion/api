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
		autoBottom: Number,
		autoMiddle: Number,
		autoTop: Number,
		teleopBottom: Number,
		teleopMiddle: Number,
		teleopTop: Number,
		linkScore: Number,
		autoDock: Boolean,
		autoEngage: Boolean,
		teleopDock: Boolean,
		teleopEngage: Boolean,
		parked: Boolean,
		chargeStation: Number,
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
