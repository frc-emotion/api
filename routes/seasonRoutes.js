const express = require("express");
const router = express.Router();
const {
	getSeasons,
	getSeasonByYear,
	getSeasonCompetitions,
	createCompetition,
	deleteCompetition,
	createSeason,
	updateSeason,
	deleteSeason,
} = require("../controllers/seasonController");

const { verifiedProtect, adminProtect } = require("../middleware/authMiddleware");

router
	.route("/")
	.post(adminProtect, createSeason)
	.get(verifiedProtect, getSeasons);
router
	.route("/:year")
	.get(verifiedProtect, getSeasonByYear)
	.put(adminProtect, updateSeason)
	.delete(adminProtect, deleteSeason);
router
	.route("/:year/competitions")
	.get(verifiedProtect, getSeasonCompetitions)
	.post(adminProtect, createCompetition)
	.delete(adminProtect, deleteCompetition);

module.exports = router;
