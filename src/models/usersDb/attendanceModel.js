const mongoose = require("mongoose");

/**
 * @typedef {Object} Attendance
 */
const attendanceSchema = mongoose.Schema({
	totalHoursLogged: { type: Number, required: true },
	logs: { type: Array, required: true }, //array of meeting ids
	completedMarketingAssignment: {
		type: Boolean,
		required: true,
		default: false,
	},
});

module.exports = global.usersDb.model("Attendance", attendanceSchema);
