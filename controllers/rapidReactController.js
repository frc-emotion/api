const asyncHandler = require("express-async-handler");
const Game = require("../models/rapidReactModel.js");

// @desc Get Games
// @route GET /api/games/{games[i].name}/
// @access Private
const getGames = asyncHandler(async (req, res) => {
    const games = await Game.find({ competition: req.params.competition });
    res.status(200).json(games);
});

// @desc Set Game
// @route POST /api/games/{games[i].name}/
// @access Private
const setGame = asyncHandler(async (req, res) => {
    const game = await Game.create({
        competition: req.params.competition,
        matchNumber: req.body.matchNumber,
        teamNumber: req.body.teamNumber,
        teamName: req.body.teamName,
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

    res.status(200).json(game);
});

// @desc Update Game
// @route PUT /api/games/{games[i].name}/:id
// @access Private
const updateGame = asyncHandler(async (req, res) => {
    const game = await Game.findById(req.params.id);

    if (!game) {
        res.status(400);
        throw new Error("Game not found");
    }

    const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedGame);
});

// @desc Delete Game
// @route DELETE /api/games/{games[i].name}/:id
// @access Private
const deleteGame = asyncHandler(async (req, res) => {
    const game = await Game.findById(req.params.id);

    if (!game) {
        res.status(400);
        throw new Error("Game not found");
    }

    await game.remove();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getGames,
    setGame,
    updateGame,
    deleteGame
}