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

const protect = require("../middleware/authMiddleware");

router.route("/").post(protect(3, createSeason)).get(getSeasons);
router
	.route("/:year")
	.get(getSeasonByYear)
	.put(protect(3, updateSeason))
	.delete(protect(3, deleteSeason));
router
	.route("/:year/competitions")
	.get(getSeasonCompetitions)
	.post(protect(3, createCompetition))
	.delete(protect(3, deleteCompetition));

module.exports = router;
