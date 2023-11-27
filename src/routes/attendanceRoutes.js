const express = require("express");
const router = express.Router();
const {
	createMeeting,
	attendMeeting,
	getMeetings,
} = require("../controllers/attendanceController");
const protect = require("../middleware/authMiddleware");

router.post("/createMeeting", protect(2, createMeeting));
router.post("/attendMeeting", protect(0, attendMeeting));
router.get("/getMeetings", protect(2, getMeetings)); //ONLY FOR TESTING, PROTECT 2

module.exports = router;
