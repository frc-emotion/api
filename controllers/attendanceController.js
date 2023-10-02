const asyncHandler = require("express-async-handler");
const Meeting = require("../models/usersDb/meetingModel.js");
const { generateToken } = require("./userController.js");
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


const getMeeting = asyncHandler(async (req, res) => {
	const { targetUser } = req.body;
	if (!targetUser) {
		res.status(400).json({ message: "Please fill in all fields properly" });
	}
	const meetings = await Meeting.find({targetUser: targetUser});
	if (meetings && meetings.length > 0) {
		res.status(200).json(meetings);
	}
	else {
		res.status(400).json({ message: "No meetings found" });
	}
});

const getAllMeeting = asyncHandler(async (req, res) => {
	const meetings = await Meeting.find();

	let validMeetings = [];

	const currentTime = Math.floor(Date.now() / 1000);

	meetings.forEach(element => {
		if (currentTime >= element.startTime && currentTime <= element.endTime) {
			validMeetings.push(element); // letsssssssssss goooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
		}
	});

	if (validMeetings && validMeetings.length > 0) {
		res.status(200).json(validMeetings);
	}
	else {
		res.status(400).json({ message: "No VALID meetings found" });
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
		res.status(201).json({
			attendance: updated.attendance,
			firstname: updated.firstname,
			lastname: updated.lastname,
			username: updated.username,
			email: updated.email,
			grade: updated.grade,
			phone: updated.phone,
			accountType: updated.accountType,
			roles: updated.roles,
			token: generateToken(updated._id),
			subteam: updated.subteam,
			_id: updated._id,
		});
	} else {
		res.status(500).json({ message: "Error" });
	}


});

module.exports = { createMeeting, attendMeeting, getMeeting, getAllMeeting };
