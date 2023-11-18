const express = require("express");
const router = express.Router();
const {
	getSeasons,
	getSeasonByYear,
	getSeasonCompetitions,
} = require("../../controllers/seasonController");
const deprecatedRoute = require("../deprecatedRoute");

router.route("/").post(deprecatedRoute).get(getSeasons);
router
	.route("/:year")
	.get(getSeasonByYear)
	.put(deprecatedRoute)
	.delete(deprecatedRoute);
router
	.route("/:year/competitions")
	.get(getSeasonCompetitions)
	.post(deprecatedRoute)
	.delete(deprecatedRoute);

module.exports = router;
