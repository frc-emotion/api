const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const colors = require("colors");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
const api = process.env.API_URL;
const app = express();
const apiVersion = 2;
const connAppend =
	process.env.NODE_ENV === "production"
		? "?retryWrites=true&w=majority&directConnection=true&authSource=admin"
		: "?retryWrites=true&w=majority";

process.env.NODE_ENV === "production"
	? (process.env.MONGO_URI = process.env.MONGO_URI_PROD)
	: (process.env.MONGO_URI = process.env.MONGO_URI_DEV);

const usersDb = connectDB(process.env.MONGO_URI + `users${connAppend}`);
usersDb.on("connected", () => {
	console.log(
		"Successfully connected to users database: " +
			`${usersDb.host}`.green.underline
	);
});

const scoutingDb = connectDB(process.env.MONGO_URI + `scouting${connAppend}`);
scoutingDb.on("connected", () => {
	console.log(
		"Successfully connected to scouting database: " +
			`${scoutingDb.host}`.green.underline
	);
});

global.usersDb = usersDb;
global.scoutingDb = scoutingDb;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add Access Control Allow Origin headers
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "*");
	next();
});

const games = [
	{ name: "rapidReact", minVersion: 1 },
	{ name: "chargedUp", minVersion: 1 },
];

const nonGameRoutes = [
	// keep 1 route path for each version even if they are the same
	{
		name: "users",
		routePath: [
			"./compatibility/v1/userRoutes.js",
			"./routes/userRoutes.js",
		],
		minVersion: 1,
	},
	{
		name: "seasons",
		routePath: ["./compatibility/v1/seasonRoutes.js", "./routes/seasonRoutes.js"],
		minVersion: 1,
	},
	{
		name: "inpit",
		routePath: ["./routes/inPitRoutes.js"],
		minVersion: 2,
	},
];

for (let i = 0; i < apiVersion; i++) {
	for (let j = 0; j < games.length; j++) {
		app.use(
			`${api}/v${i + 1}/${games[j].name}`,
			require(`./routes/${games[j].name}Routes`)
		);
	}
}

for (let i = 0; i < nonGameRoutes.length; i++) {
	for (let j = nonGameRoutes[i].minVersion; j <= apiVersion; j++) {
		app.use(
			`${api}/v${j}/${nonGameRoutes[i].name}`,
			require(nonGameRoutes[i].routePath[j - nonGameRoutes[i].minVersion])
		);
	}
}

app.use(cors);
app.use(errorHandler);

app.listen(port, () => {
	console.log("Server started at: " + `localhost:${port}`.underline.green);
});
