const express = require("express");
const router = express.Router();
const {
	createMeeting,
	attendMeeting,
} = require("../controllers/attendanceController");
const protect = require("../middleware/authMiddleware");

router.post("/createMeeting", protect(2, createMeeting));
router.post("/attendMeeting", protect(0, attendMeeting));

module.exports = router;
