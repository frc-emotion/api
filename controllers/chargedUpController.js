const asyncHandler = require("express-async-handler");
const ChargedUp = require("../models/chargedUpModel.js");

async function create(req) {
	return await ChargedUp.create({
		competition: req.body.competition,
		matchNumber: req.body.matchNumber,
		teamNumber: req.body.teamNumber,
		teamName: req.body.teamName,
		RPEarned: req.body.RPEarned,
		totalRP: req.body.totalRP,
		autoBottom: req.body.autoBottom,
		autoMiddle: req.body.autoMiddle,
		autoTop: req.body.autoTop,
		teleopBottom: req.body.teleopBottom,
		teleopMiddle: req.body.teleopMiddle,
		teleopTop: req.body.teleopTop,
		linkScore: req.body.linkScore,
		autoDock: req.body.autoDock,
		autoEngage: req.body.autoEngage,
		teleopDock: req.body.teleopDock,
		teleopEngage: req.body.teleopEngage,
		parked: req.body.parked,
		chargeStation: req.body.chargeStation,
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

const createGame = asyncHandler(async (req, res) => {
	const game = await create(req);
	res.status(201).json(game);
});

const updateGame = asyncHandler(async (req, res) => {
	const game = await ChargedUp.findById(req.params.id);
	if (!game) {
		res.status(400);
		throw new Error("Game not found");
	}
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
