const asyncHandler = require("express-async-handler");
const fetch = (...args) =>
	import("node-fetch").then(({ default: fetch }) => fetch(...args));

const fillTeamName = asyncHandler(async (req, res, next) => {
	const key = process.env.TBA_KEY;

	const request = await fetch(
		"https://www.thebluealliance.com/api/v3/team/frc" + req.body.teamNumber,
		{ method: "GET", headers: { "X-TBA-Auth-Key": key } }
	);
	const jsoned = await request.json();
	if (request.status != 200) {
		try {
			req.body.teamName = "-1";
		} catch (ValidationError) {
			res.status(400).json({ error: "Invalid request body" });
		}
	} else {
		try {
			req.body.teamName = jsoned["nickname"];
		} catch (ValidationError) {
			res.status(400).json({ error: "Invalid request body" });
		}
	}
	next();
});

module.exports = fillTeamName;
