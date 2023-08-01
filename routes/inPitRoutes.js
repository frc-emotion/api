const express = require("express");
const router = express.Router();
const {
	editProfile,
	getProfile,
	deleteProfile,
} = require("../controllers/inPitController");
const fillTeamName = require("../middleware/fillTeamName");
const protect = require("../middleware/authMiddleware");

// all routes require user to be verified before making a request
// authorization middleware checks for bearer token in header
router.route("/getProfile").get(protect(1, getProfile));
router
	.route("/editProfile")
	.post(protect(1), fillTeamName, editProfile)
	.delete(protect(1, deleteProfile));

module.exports = router;
