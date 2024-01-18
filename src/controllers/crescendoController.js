const asyncHandler = require("express-async-handler");
const Crescendo = require("../models/scoutingDb/crescendoModel.js");
const fetch = (...args) =>
	import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function create(req) {
	return await Crescendo.create({
		competition: req.body.competition,
		matchNumber: req.body.matchNumber,
		teamNumber: req.body.teamNumber,
		teamName: req.body.teamName,
		rankingPoints: req.body.rankingPoints,
		auto: req.body.auto,
		teleop: req.body.teleop,
		stage: req.body.stage,
		ranking: req.body.ranking,
	});
}

const getGames = asyncHandler(async (req, res) => {
	try {
		const games = req.params.id
			? await Crescendo.findById(req.params.id)
			: await Crescendo.find(req.query);

		res.status(200).json(games);
	} catch (e) {
		res.status(500).json({ message: "Error" });
		return;
	}
});

async function handleBlueAlliance(req) {
	const key = process.env.TBA_KEY;
	const request = await fetch(
		"https://www.thebluealliance.com/api/v3/team/frc" + req.body.teamNumber,
		{ method: "GET", headers: { "X-TBA-Auth-Key": key } }
	);
	const jsoned = await request.json();
	try {
		const teamname = jsoned["nickname"];
		return { ...req.body, teamName: teamname };
	} catch (e) {
		return { ...req.body, teamName: "-1" };
	}
}

const createGame = asyncHandler(async (req, res) => {
	try {
		const body = await handleBlueAlliance(req);
		req.body = body;
		const game = await create(req);
		res.status(201).json(game);
	} catch (e) {
		res.status(500).json({ message: "Error" });
		return;
	}
});

const updateGame = asyncHandler(async (req, res) => {
	try {
		const game = await Crescendo.findById(req.params.id);
		if (!game) {
			res.status(400);
			throw new Error("Game not found");
		}
		game.editHistory.splice(0, 0, req.edit);
		req.body.editHistory = game.editHistory;
		const updatedGame = await Crescendo.findByIdAndUpdate(
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

const deleteGame = asyncHandler(async (req, res) => {
	try {
		const game = await Crescendo.findById(req.params.id);

		if (!game) {
			res.status(400);
			throw new Error("Game not found");
		}

		await game.remove();

		res.status(200).json({
			id: req.params.id,
			message: "Game deleted",
		});
	} catch (e) {
		res.status(500).json({ message: "Error" });
		return;
	}
});

module.exports = {
	getGames,
	createGame,
	updateGame,
	deleteGame,
};
