const express = require("express");
const router = express.Router();
const {
    editProfile,
    getAllProfiles,
    getProfile,
    deleteProfile
} = require("../controllers/inPitController");

const { verifiedProtect } = require("../middleware/authMiddleware");

// all routes require user to be verified before making a request
// authorization middleware checks for bearer token in header
router.route("/getProfile").get(verifiedProtect, getProfile);
router.route("/getAllProfiles").get(verifiedProtect, getAllProfiles);
router.route("/editProfile").post(verifiedProtect, editProfile).delete(verifiedProtect, deleteProfile);

module.exports = router;
