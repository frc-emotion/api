const express = require("express");
const router = express.Router();
const {
	createMeeting,
	attendMeeting,
	getMeetings,
	deleteMeeting,
} = require("../controllers/attendanceController");
const protect = require("../middleware/authMiddleware");

router.post("/createMeeting", protect(2, createMeeting));
router.post("/attendMeeting", protect(0, attendMeeting));
router.get("/getMeetings", protect(2, getMeetings));
router.delete("/deleteMeeting/:id", protect(2, deleteMeeting));

module.exports = router;
