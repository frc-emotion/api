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
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, DELETE"
	);
	next();
});

const routes = [
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
		routePath: [
			"./compatibility/v1/seasonRoutes.js",
			"./routes/seasonRoutes.js",
		],
		minVersion: 1,
	},
	{
		name: "inpit",
		routePath: ["./routes/inPitRoutes.js"],
		minVersion: 2,
	},
	{
		name: "rapidReact",
		routePath: [
			"./compatibility/v1/rapidReactRoutes.js",
			"./routes/rapidReactRoutes.js",
		],
		minVersion: 1,
	},
	{
		name: "chargedUp",
		routePath: [
			"./compatibility/v1/chargedUpRoutes.js",
			"./routes/chargedUpRoutes.js",
		],
		minVersion: 1,
	},
	{
		name: "attendance",
		routePath: ["./routes/attendanceRoutes.js"],
		minVersion: 2,
	},
];

for (let i = 0; i < routes.length; i++) {
	for (let j = routes[i].minVersion; j <= apiVersion; j++) {
		app.use(
			`${api}/v${j}/${routes[i].name}`,
			require(routes[i].routePath[j - routes[i].minVersion])
		);
	}
}

app.use(cors);
app.use(errorHandler);

app.listen(port, () => {
	console.log("Server started at: " + `localhost:${port}`.underline.green);
});
