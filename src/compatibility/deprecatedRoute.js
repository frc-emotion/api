const asyncHandler = require("express-async-handler");

const deprecatedRoute = asyncHandler(async (req, res) => {
	res.status(410).json({
		message:
			"Route is deprecated. Use 'https://api.team2658.org/v2' instead.",
	});
});

module.exports = deprecatedRoute;