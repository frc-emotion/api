const Double = require("@mongoosejs/double/lib");
const mongoose = require("mongoose");

const meetingSchema = mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    tapInTime: { type: Number, required: true },
    tapOutTime: { type: Number, required: true },
    tappedBy: { type: Schema.types.ObjectId, required: false },
    verified: { type: Boolean, required: true, default: false },
})

const attendanceSchema = mongoose.Schema({
    totalHoursLogged: Double,
    meetingHoursLogged: Double,
    volunteerHoursLogged: Double,
    competitionHoursLogged: Double,
    logs: [meetingSchema]
});

module.exports = global.scoutingDb.model("Attendance", attendanceSchema);