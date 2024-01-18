const Double = require("@mongoosejs/double/lib");
const mongoose = require("mongoose");

const crescendoSchema = mongoose.Schema(
	{
		editHistory: Array,
		competition: { type: String, required: true },
		teamNumber: { type: Number, required: true },
		matchNumber: { type: Number, required: true },
		teamName: { type: String, required: true },
		rankingPoints: Number,
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
			state: "NOT_PARKED" | "PARKED" | "ONSTAGE" | "ONSTAGE_SPOTLIT",
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
