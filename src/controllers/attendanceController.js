const asyncHandler = require("express-async-handler");
const Meeting = require("../models/usersDb/meetingModel.js");
const { generateToken } = require("./userController.js");
const User = require("../models/usersDb/userModel.js");

const createMeeting = asyncHandler(async (req, res) => {
	try {
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
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Error" });
		return;
	}
});

const getMeetings = asyncHandler(async (req, res) => {
	try {
		const meetings = await Meeting.find({}).where("endTime").gt(Date.now());

		if (meetings) {
			res.status(200).json(meetings);
		} else {
			res.status(404).json({ message: "No meetings found" });
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Error" });
		return;
	}
});

const getAllMeetings = asyncHandler(async (req, res) => {
	try {
		const meetings = await Meeting.find({});

		if (meetings) {
			res.status(200).json(meetings);
		} else {
			res.status(404).json({ message: "No meetings found" });
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Error" });
		return;
	}
});

const deleteMeeting = asyncHandler(async (req, res) => {
	const id = req.params.id;
	if (id) {
		try {
			const deleted = await Meeting.findByIdAndDelete(id);
			if (deleted) {
				res.status(200).json({ message: "Meeting deleted" });
			} else {
				res.status(404).json({ message: "Meeting not found" });
			}
		} catch (e) {
			console.error(e);
			res.status(500).json({ message: "Server Error" });
			return;
		}
	} else res.status(400).json({ message: "Please provide an id" });
});

async function getHoursFromLogs(arr) {
	let total = 0;
	try {
		if (Array.isArray(arr)) {
			console.log(arr);
			for (let i = 0; i < arr.length; i++) {
				const meeting = await Meeting.findById(arr[i]);
				if (meeting) {
					total += meeting.value;
				}
			}
		}
	} catch (e) {
		console.error(e);
	}
	console.log(total);
	return total;
}

const attendMeeting = asyncHandler(async (req, res) => {
	const { meetingId, tapTime } = req.body;

	const userId = req.user._id;
	if (!meetingId || !userId || !tapTime || Number.isNaN(tapTime)) {
		res.status(400).json({ message: "Please fill in all fields properly" });
		return;
	}

	try {
		const meeting = await Meeting.findById(meetingId);
		if (!meeting) {
			res.status(404).json({ message: "Meeting not found" });
			return;
		}

		if (meeting.startTime > tapTime || meeting.endTime < tapTime) {
			res.status(400).json({
				message: "Tap time is not within meeting time",
			});
			return;
		} else {
			const user = await User.findById(userId);
			if (!user) {
				res.status(404).json({ message: "User not found" });
				return;
			}

			if (user.attendance?.at(-1)?.logs.includes(meetingId)) {
				res.status(400).json({
					message: "You have already attended this meeting",
				});
				return;
			}

			let hoursLogged = 0;
			if (Array.isArray(user.attendance?.at(1)?.logs)) {
				hoursLogged = Number(
					meeting.value +
						(await getHoursFromLogs(user.attendance?.at(1)?.logs))
				);
			} else {
				hoursLogged = meeting.value;
			}

			const attendance = {
				totalHoursLogged: hoursLogged,
				logs: [...(user.attendance?.at(1)?.logs ?? []), meetingId],
				completedMarketingAssignment:
					user.attendance?.at(1)?.completedMarketingAssignment ===
					true,
			};

			console.log(attendance);

			const updated = await User.findByIdAndUpdate(
				userId,
				{ attendance: [user.attendance[0], attendance] },
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
				return;
			}
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Error" });
		return;
	}
});

module.exports = {
	createMeeting,
	attendMeeting,
	getMeetings,
	deleteMeeting,
	getAllMeetings,
};
