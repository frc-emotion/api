const express = require("express");
const router = express.Router();
const {
    editProfile,
    getAllProfiles,
    getProfile,
    deleteProfile
} = require("../controllers/inPitController");

const { verifiedProtect } = require("../middleware/authMiddleware");
const { editHistory } = require("../middleware/editHistory")

// all routes require user to be verified before making a request
// authorization middleware checks for bearer token in header
router.route("/getProfile").get(getProfile);
router.route("/getAllProfiles").get(getAllProfiles);
router.route("/editProfile").post(editProfile).delete(deleteProfile)

module.exports = router;
