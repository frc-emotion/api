const asyncHandler = require("express-async-handler");
const User = require("../models/usersModel.js");

// @desc Get Users
// @route GET /api/users/
// @access Private
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ name: req.params.name });
    res.status(200).json(users);
});

module.exports = {
    getUsers
}