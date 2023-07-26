const mongoose = require("mongoose");

const subSchema = new mongoose.Schema({
	content: { type: mongoose.Mixed, required: true },
	user: { type: String, required: true },
	timestamp: { type: String, required: true },
	_id: false,
});

const pitSchema = mongoose.Schema({
	teamNumber: { type: Number, required: true, unique: true },
	teamName: { type: String, required: true, unique: true },
	working: [subSchema],
	numOfChargers: [subSchema],
	numOfBatteries: [subSchema],
	drivetrain: [subSchema], // Ex. Tank, Mecanum, Swerve, etc.
	preferredScoringType: [subSchema], // Ex. High Mid Low
	preferredScoringMethod: [subSchema], // Ex. Cone Cube Both
	comments: [subSchema],
});

module.exports = global.scoutingDb.model("InPit", pitSchema);
