const express = require("express");
const router = express.Router();
const {
	createMeeting,
	attendMeeting,
	getAllMeeting,
	getMeeting
} = require("../controllers/attendanceController");
const protect = require("../middleware/authMiddleware");

router.post("/createMeeting", protect(2, createMeeting));
router.post("/attendMeeting", protect(0, attendMeeting));
router.post('/getAllMeeting', protect(2, getAllMeeting));
router.post('/getMeeting', protect(2, getMeeting));

module.exports = router;
