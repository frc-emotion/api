const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
const api = process.env.API_URL;
const app = express();
const games = [{ name: "rapidReact" }, { name: "chargedUp" }];
const MONGO_URI =
	process.env.NODE_ENV === "production"
		? process.env.MONGO_URI_PROD
		: process.env.MONGO_URI_DEV;

// connect to the MongoDB database, configure in ./config/db.js

const connAppend =
	process.env.NODE_ENV === "production"
		? "?retryWrites=true&w=majority&directConnection=true&authSource=admin"
		: "?retryWrites=true&w=majority";

const gamesDb = connectDB(process.env.MONGO_URI + `games${connAppend}`);
gamesDb.on("connected", () => {
	console.log(
		"Successfully connected to games database: " +
			`${gamesDb.host}`.green.underline
	);
});

const usersDb = connectDB(process.env.MONGO_URI + `users${connAppend}`);
usersDb.on("connected", () => {
	console.log(
		"Successfully connected to users database: " +
			`${usersDb.host}`.green.underline
	);
});

const seasonsDb = connectDB(process.env.MONGO_URI + `seasons${connAppend}`);
seasonsDb.on("connected", () => {
	console.log(
		"Successfully connected to seasons database: " +
			`${seasonsDb.host}`.green.underline
	);
});

const scoutingDb = connectDB(process.env.MONGO_URI + `scouting${connAppend}`);
scoutingDb.on("connected", () => {
	console.log(
		"Successfully connected to scouting database: " +
			`${scoutingDb.host}`.green.underline
	);
});

global.gamesDb = gamesDb;
global.usersDb = usersDb;
global.seasonsDb = seasonsDb;
global.scoutingDb = scoutingDb;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add Access Control Allow Origin headers
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

for (let i = 0; i < games.length; i++) {
	app.use(
		`${api}/${games[i].name}`,
		require(`./routes/${games[i].name}Routes`)
	);
}

app.use(`${api}/users`, require("./routes/userRoutes.js"));
app.use(`${api}/seasons`, require("./routes/seasonRoutes.js"));
app.use(`${api}/scouting`, require("./routes/inPitRoutes.js"));

app.use(errorHandler);

app.listen(port, () => {
	console.log("Server started at: " + `localhost:${port}`.underline.green);
});
