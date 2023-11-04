const asyncHandler = require("express-async-handler");
const ChargedUp = require("../models/scoutingDb/chargedUpModel.js");
const fetch = (...args) =>
	import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function create(req) {
	return await ChargedUp.create({
		editHistory: req.edit,
		competition: req.body.competition,
		matchNumber: req.body.matchNumber,
		teamNumber: req.body.teamNumber,
		teamName: req.body.teamName,
		RPEarned: req.body.RPEarned,
		totalRP: req.body.totalRP,
		autoPeriod: req.body.autoPeriod,
		teleopPeriod: req.body.teleopPeriod,
		coneRate: req.body.coneRate,
		cubeRate: req.body.cubeRate,
		linkScore: req.body.linkScore,
		autoDock: req.body.autoDock,
		autoEngage: req.body.autoEngage,
		teleopDock: req.body.teleopDock,
		teleopEngage: req.body.teleopEngage,
		parked: req.body.parked,
		isDefensive: req.body.isDefensive,
		chargeStation: req.body.chargeStation,
		didBreak: req.body.didBreak,
		penaltyCount: req.body.penaltyCount,
		score: req.body.score,
		won: req.body.won,
		tied: req.body.tied,
		comments: req.body.comments,
	});
}

const getGames = asyncHandler(async (req, res) => {
	const games = req.params.id
		? await ChargedUp.findById(req.params.id)
		: await ChargedUp.find(req.query);

	res.status(200).json(games);
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
	const body = await handleBlueAlliance(req);
	req.body = body;
	const game = await create(req);
	res.status(201).json(game);
});

const updateGame = asyncHandler(async (req, res) => {
	const game = await ChargedUp.findById(req.params.id);
	if (!game) {
		res.status(400);
		throw new Error("Game not found");
	}
	game.editHistory.splice(0, 0, req.edit);
	req.body.editHistory = game.editHistory;
	const updatedGame = await ChargedUp.findByIdAndUpdate(
		req.params.id,
		req.body,
		{
			new: true,
		}
	);

	res.status(200).json(updatedGame);
});

const deleteGame = asyncHandler(async (req, res) => {
	const game = await ChargedUp.findById(req.params.id);

	if (!game) {
		res.status(400);
		throw new Error("Game not found");
	}

	await game.remove();

	res.status(200).json({
		id: req.params.id,
		message: "Game deleted",
	});
});

module.exports = {
	getGames,
	createGame,
	updateGame,
	deleteGame,
};
