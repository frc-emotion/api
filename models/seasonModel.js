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
		competitions: Array,
	},
	{
		timestamps: true,
	}
);

module.exports = global.seasonsDb.model("Season", seasonSchema);
