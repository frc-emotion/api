const asyncHandler = require("express-async-handler");
const Season = require("../models/seasonModel.js");

const getSeasons = asyncHandler(async (req, res) => {
	const seasons = await Season.find({}).sort({ year: -1 });
	res.json(seasons);
});

const getSeasonByYear = asyncHandler(async (req, res) => {
	const season = await Season.findOne({ year: req.params.year });
	if (season) {
		res.json(season);
	} else {
		res.status(404);
		throw new Error("Season not found");
	}
});

const getSeasonCompetitions = asyncHandler(async (req, res) => {
	const season = await Season.findOne({ year: req.params.year });
	if (season) {
		res.json(season.competitions);
	} else {
		res.status(404);
		throw new Error("Season not found");
	}
});

const createCompetition = asyncHandler(async (req, res) => {
	const season = await Season.findOne({ year: req.params.year });
	if (season) {
		season.competitions.push(req.body.competition);
	} else {
		res.status(404);
		throw new Error("Season not found");
	}
	const updatedSeason = await season.save();
	res.status(201).json(updatedSeason);
});

const deleteCompetition = asyncHandler(async (req, res) => {
	const season = await Season.findOne({ year: req.params.year });
	if (season) {
		for (let i = 0; i < season.competitions.length; i++) {
			if (season.competitions[i] === req.body.competition) {
				season.competitions.splice(i, 1);
				season.save();
				break;
			}
		}
		res.status(200).json(season);
	} else {
		res.status(404);
		throw new Error("Season not found");
	}
});

const createSeason = asyncHandler(async (req, res) => {
	const season = await Season.create({
		year: req.body.year,
		name: req.body.name,
		competitions: req.body.competitions,
	});
	res.status(201).json(season);
});

const updateSeason = asyncHandler(async (req, res) => {
	const season = await Season.findOne({ year: req.params.year });
	if (season) {
		season.year = req.body.year ? req.body.year : season.year;
		season.name = req.body.name ? req.body.name : season.name;
		season.competitions = req.body.competitions
			? req.body.competitions
			: season.competitions;
	} else {
		res.status(404);
		throw new Error("Season not found");
	}
	const updatedSeason = await season.save();
	res.status(201).json(updatedSeason);
});

const deleteSeason = asyncHandler(async (req, res) => {
	const season = await Season.findOne({ year: req.params.year });
	if (season) {
		await season.remove();
		res.json({ message: "Season removed" });
	} else {
		res.status(404);
		throw new Error("Season not found");
	}
});

module.exports = {
	getSeasons,
	getSeasonByYear,
	getSeasonCompetitions,
	createCompetition,
	deleteCompetition,
	createSeason,
	updateSeason,
	deleteSeason,
};
