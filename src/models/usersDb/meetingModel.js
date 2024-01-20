const mongoose = require("mongoose");

// const meetingSchema = mongoose.Schema({
//     name: { type: String, required: true },
//     type: { type: String, required: true },
//     tapInTime: { type: Number, required: true },
//     tapOutTime: { type: Number, required: true },
//     tappedBy: { type: Schema.types.ObjectId, required: false },
//     verified: { type: Boolean, required: true, default: false },
// })

// const attendanceSchema = mongoose.Schema({
//     totalHoursLogged: Double,
//     meetingHoursLogged: Double,
//     volunteerHoursLogged: Double,
//     competitionHoursLogged: Double,
//     logs: [meetingSchema]
// });

// module.exports = global.scoutingDb.model("Attendance", attendanceSchema);

const meetingSchema = mongoose.Schema({
	startTime: { type: Number, required: true }, //UNIX timestamp
	endTime: { type: Number, required: true }, //UNIX timestamp
	type: { type: String, required: true, lowercase: true, trim: true }, // "meeting" | "competition" | "volunteer"
	description: { type: String, required: false, trim: true },
	value: { type: Number, required: true }, // number of hours the meeting is worth (default 1 for meetings, 4 for competitions)
	createdBy: { type: String, required: true }, // username of the user who created the meeting
	attendancePeriod: { type: String, required: true }, // the attendance period the meeting is in, format is yearPeriod (ex. 2023fall)
});

module.exports = global.usersDb.model("Meeting", meetingSchema);
