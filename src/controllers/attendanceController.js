const asyncHandler = require("express-async-handler");
const Meeting = require("../models/usersDb/meetingModel.js");
const { generateToken } = require("./userController.js");
const User = require("../models/usersDb/userModel.js");
const Season = require("../models/scoutingDb/seasonModel.js");

const createMeeting = asyncHandler(async (req, res) => {
	try {
		const {
			startTime,
			endTime,
			type,
			description,
			value,
			attendancePeriod,
		} = req.body;

		const createdBy = req.user._id;

		if (
			!startTime ||
			!endTime ||
			!type ||
			!value ||
			isNaN(value) ||
			!attendancePeriod
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
			attendancePeriod,
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
				attendancePeriod: meeting.attendancePeriod,
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
	const { meetingId, tapTime, verifiedBy } = req.body;

	const userId = req.user._id;
	if (
		!meetingId ||
		!userId ||
		!tapTime ||
		Number.isNaN(tapTime) ||
		!verifiedBy
	) {
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

			//#region migration
			/**
			 * @typedef {Object} Log
			 * @property {string} meetingId
			 * @property {string | null} verifiedBy
			 */

			/**
			 * @type {Record<string, {totalHoursLogged: number, logs: Log[] | string[], completedMarketingAssignment: boolean}>}
			 */
			const att = {
				...(Array.isArray(user.attendance) ? {} : user.attendance),
			};
			const compat = ["2023fall", "2024spring"];
			if (Array.isArray(user.attendance)) {
				for (let i = 0; i < user.attendance.length; i++) {
					const seasons = await Season.find({ year: 2023 + i });
					att[seasons.attendancePeriod[0] ?? compat[i]] =
						user.attendance?.at(i);
				}
			}

			Object.values(att).forEach((a, i) => {
				a.logs.forEach((l, j) => {
					if (!l.meetingId) {
						att[Object.keys(att)[i]].logs[j] = {
							meetingId: l,
							verifiedBy: "unknown",
						};
					}
				});
			});
			//#endregion

			if (
				att[meeting.attendancePeriod]?.logs?.includes(meetingId) == true
				|| att[meeting.attendancePeriod]?.logs?.some(l => l.meetingId === meetingId) == true
			) {
				res.status(400).json({
					message: "You have already logged this meeting",
				});
				return;
			}

			let hoursLogged = 0;
			if (Array.isArray(att[meeting.attendancePeriod]?.logs)) {
				hoursLogged = Number(
					meeting.value +
						(await getHoursFromLogs(
							att[meeting.attendancePeriod]?.logs.map(l => l?.meetingId ?? l)
						))
				);
			} else {
				hoursLogged = meeting.value;
			}

			const attendance = {
				totalHoursLogged: hoursLogged,
				logs: [
					...(att[meeting.attendancePeriod]?.logs ?? []),
					{meetingId, verifiedBy},
				],
				completedMarketingAssignment:
					att[meeting.attendancePeriod]
						?.completedMarketingAssignment === true,
			};

			console.log(attendance);

			att[meeting.attendancePeriod] = attendance;

			const updated = await User.findByIdAndUpdate(
				userId,
				{ attendance: { ...att } },
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
