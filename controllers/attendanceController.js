const asyncHandler = require("express-async-handler");
const Meeting = require("../models/usersDb/meetingModel.js");
const Attendance = require("../models/usersDb/attendanceModel.js");
const User = require("../models/usersDb/userModel.js");

const createMeeting = asyncHandler(async (req, res) => {
	const { startTime, endTime, type, description, value, createdBy } =
		req.body;

	if (
		!startTime ||
		!endTime ||
		!type ||
		!value ||
		!createdBy ||
		isNaN(value)
	) {
		res.status(400).json({
			message: "Please fill in all required fields correctly",
		});
	}

	const meeting = await Meeting.create({
		startTime,
		endTime,
		type,
		description,
		value,
		createdBy,
	});

	if (meeting) {
		res.status(201).json({
			_id: meeting._id,
			startTime: meeting.startTime,
			endTime: meeting.endTime,
			type: meeting.type,
			description: meeting.description,
			value: meeting.value,
			createdBy: meeting.createdBy,
		});
	} else {
		res.status(400).json({ message: "Invalid meeting data" });
	}
});

const attendMeeting = asyncHandler(async (req, res) => {
	const { meetingId, userId, tapTime } = req.body;

	if (!meetingId || !userId || !tapTime || Number.isNaN(tapTime)) {
		res.status(400).json({ message: "Please fill in all fields properly" });
	}

	const meeting = await Meeting.findById(meetingId);
	if (!meeting) {
		res.status(400).json({ message: "Meeting not found" });
	}

	if (!(meeting.startTime <= tapTime && meeting.endTime >= tapTime)) {
		res.status(400).json({
			message: "Tap time is not within meeting time",
		});
	}

	const user = await User.findById(userId);
	if (!user) {
		res.status(400).json({ message: "User not found" });
	}

	const attendance = {
		totalHoursLogged: isNaN(
			Number(user.attendance?.at(-1)?.totalHoursLogged)
		)
			? meeting.value
			: Number(user.attendance?.at(-1)?.totalHoursLogged) + meeting.value,
		logs: [...(user.attendance?.at(-1)?.logs ?? []), meetingId],
		completedMarketingAssignment:
			user.attendance?.at(-1)?.completedMarketingAssignment === true,
	};

	console.log(attendance);

	const updated = await User.findByIdAndUpdate(
		userId,
		{ attendance: [attendance] },
		{ new: true }
	);

	if (updated) {
		res.status(201).json(updated);
	} else {
		res.status(500).json({ message: "Error" });
	}
});

module.exports = { createMeeting, attendMeeting };
