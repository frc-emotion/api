const asyncHandler = require("express-async-handler");
const Season = require("../models/scoutingDb/seasonModel.js");

const getSeasons = asyncHandler(async (req, res) => {
	try {
		const seasons = await Season.find({}).sort({ year: -1 });
		res.json(seasons);
	} catch (e) {
		res.status(500).json({ message: "Error" });
	}
});

const getSeasonByYear = asyncHandler(async (req, res) => {
	try {
		const season = await Season.findOne({ year: req.params.year });
		if (season) {
			res.json(season);
		} else {
			res.status(404);
			throw new Error("Season not found");
		}
	} catch (e) {
		res.status(500).json({ message: "Error" });
	}
});

const getSeasonCompetitions = asyncHandler(async (req, res) => {
	try {
		const season = await Season.findOne({ year: req.params.year });
		if (season) {
			res.json(season.competitions);
		} else {
			res.status(404);
			throw new Error("Season not found");
		}
	} catch (e) {
		res.status(500).json({ message: "Error" });
	}
});

const createCompetition = asyncHandler(async (req, res) => {
	try {
		const season = await Season.findOne({ year: req.params.year });
		if (season) {
			season.competitions.push(req.body.competition);
		} else {
			res.status(404);
			throw new Error("Season not found");
		}
		const updatedSeason = await season.save();
		res.status(201).json(updatedSeason);
	} catch (e) {
		res.status(500).json({ message: "Error" });
	}
});

const deleteCompetition = asyncHandler(async (req, res) => {
	try {
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
	} catch (e) {
		res.status(500).json({ message: "Error" });
	}
});

const createSeason = asyncHandler(async (req, res) => {
	try {
		const season = await Season.create({
			year: req.body.year,
			name: req.body.name,
			competitions: req.body.competitions,
		});
		res.status(201).json(season);
	} catch (e) {
		res.status(500).json({ message: "Error" });
	}
});

const updateSeason = asyncHandler(async (req, res) => {
	try {
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
	} catch (e) {
		res.status(500).json({ message: "Error" });
	}
});

const deleteSeason = asyncHandler(async (req, res) => {
	try {
		const season = await Season.findOne({ year: req.params.year });
		if (season) {
			await season.remove();
			res.json({ message: "Season removed" });
		} else {
			res.status(404);
			throw new Error("Season not found");
		}
	} catch (e) {
		res.status(500).json({ message: "Error" });
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
