const asyncHandler = require("express-async-handler");
const Game = require("../models/scoutingDb/rapidReactModel.js");
const fetch = (...args) =>
	import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function create(req, nickname) {
	return await Game.create({
		editHistory: req.edit,
		competition: req.body.competition,
		matchNumber: req.body.matchNumber,
		teamNumber: req.body.teamNumber,
		teamName: nickname,
		tarmac: req.body.tarmac,
		autoLower: req.body.autoLower,
		autoUpper: req.body.autoUpper,
		teleopLower: req.body.teleopLower,
		teleopUpper: req.body.teleopUpper,
		cycleTime: req.body.cycleTime,
		mainShots: req.body.mainShots,
		climbScore: req.body.climbScore,
		defensive: req.body.defensive,
		humanShot: req.body.humanShot,
		rankingPoints: req.body.rankingPoints,
		score: req.body.score,
		won: req.body.won,
		comments: req.body.comments,
	});
}

// @desc Get Games
// @route GET /api/rapidReact/
// @route GET /api/rapidReact/:id
// @route GET /api/rapidReact?competition={competition}
// @access Private
const getGames = asyncHandler(async (req, res) => {
	try {
		// 3 cases: id provided, competition queried, or all
		const games = req.params.id
			? await Game.findById(req.params.id)
			: await Game.find(req.query);

		console.log(req.headers.authorization);
		res.status(200).json(games);
	} catch (e) {
		res.status(500).json({ message: "Error" });
		return;
	}
});

// @desc Set Game
// @route POST /api/rapidReact/
// @access Private
const setGame = asyncHandler(async (req, res) => {
	const key = process.env.TBA_KEY;

	const request = await fetch(
		"https://www.thebluealliance.com/api/v3/team/frc" + req.body.teamNumber,
		{ method: "GET", headers: { "X-TBA-Auth-Key": key } }
	);
	const jsoned = await request.json();
	if (request.status != 200) {
		try {
			await create(req, "-1").then((game) => {
				res.status(200).json(game);
			});
		} catch (ValidationError) {
			res.status(400).json({ error: "Invalid request body" });
		}
	} else {
		try {
			await create(req, jsoned["nickname"]).then((game) => {
				res.status(200).json(game);
			});
		} catch (ValidationError) {
			res.status(400).json({ error: "Invalid request body" });
		}
	}
});

// @desc Update Game
// @route PUT /api/rapidReact/:id
// @access Private
const updateGame = asyncHandler(async (req, res) => {
	try {
		const game = await Game.findById(req.params.id);

		if (!game) {
			res.status(400);
			throw new Error("Game not found");
		}
		game.editHistory.splice(0, 0, req.edit[0]);
		req.body.editHistory = game.editHistory;
		const updatedGame = await Game.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
			}
		);

		res.status(200).json(updatedGame);
	} catch (e) {
		res.status(500).json({ message: "Error" });
		return;
	}
});

// @desc Delete Game
// @route DELETE /api/rapidReact/:id
// @access Private
const deleteGame = asyncHandler(async (req, res) => {
	try {
		const game = await Game.findById(req.params.id);

		if (!game) {
			res.status(400);
			throw new Error("Game not found");
		}

		await game.remove();

		res.status(200).json({ id: req.params.id });
	} catch (e) {
		res.status(500).json({ message: "Error" });
		return;
	}
});

module.exports = {
	getGames,
	setGame,
	updateGame,
	deleteGame,
};
