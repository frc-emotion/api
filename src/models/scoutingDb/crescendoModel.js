const Double = require("@mongoosejs/double/lib");
const mongoose = require("mongoose");

const crescendoSchema = mongoose.Schema(
	{

		editHistory: Array,
		competition: { type: String, required: true },
		teamNumber: { type: Number, required: true },
		matchNumber: { type: Number, required: true },
		teamName: { type: String, required: true },
		rankingPoints: {type: Number, required: true},
		score: { type: Number, required: true },
		penaltyPointsEarned: { type: Number, required: true },
		won: {type: Boolean, required: true},
		tied: { type: Boolean, required: true },
		defensive: { type: Boolean, required: true },
		brokeDown: {type: Boolean, required: true},
		auto: {
			leave: Boolean,
			ampNotes: Number,
			speakerNotes: Number
		},
		teleop: {
			ampNotes: Number,
			speakerUnamp: Number,
			speakerAmp: Number
		},
		stage: {
			state: String,
			harmony: Number,
			trapNotes: Number
		},
		ranking: {
			melody: Boolean,
			ensemble: Boolean
		},
		comments: String,
	},
	{
		timestamps: true,
	}
);

module.exports = global.scoutingDb.model("Crescendo", crescendoSchema);
