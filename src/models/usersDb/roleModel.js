const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		unique: true,
	},
	permissions: {
		standScouting: { type: Boolean, default: false },
		inPitScouting: { type: Boolean, default: false },
		viewScoutingData: { type: Boolean, default: false },
		makeBlogPosts: { type: Boolean, default: false },
		verifySubteamAttendance: { type: Boolean, default: false },
		verifyAllAttendance: { type: Boolean, default: false },
		makeAnnouncements: { type: Boolean, default: false },
		required: true,
	},
});

module.exports = global.usersDb.model("Role", roleSchema);