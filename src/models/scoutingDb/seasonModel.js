const mongoose = require("mongoose");

const seasonSchema = mongoose.Schema(
	{
		/* user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		}, */
		year: { type: Number, required: true, unique: true },
		name: { type: String, required: true },
		competitions: { type: [String], required: true }, //array of strings
		attendancePeriods: { type: [String], required: false }, //array of strings
	},
	{
		timestamps: true,
	}
);

module.exports = global.scoutingDb.model("Season", seasonSchema);
