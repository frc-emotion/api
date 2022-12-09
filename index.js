const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
const api = process.env.API_URL;
const app = express();
const games = [{ name: "rapidReact" }];

// connect to the MongoDB database, configure in ./config/db.js

const gamesDb = connectDB(process.env.MONGO_URI + "games?retryWrites=true&w=majority")
gamesDb.on('connected', () => {
    console.log("Successfully connected to games database.")
  });
const usersDb = connectDB(process.env.MONGO_URI + "users?retryWrites=true&w=majority");
usersDb.on('connected', () => {
    console.log("Successfully connected to users database.")
});

global.gamesDb = gamesDb;
global.usersDb = usersDb;


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

app.use(`${api}/users`, require('./routes/usersRoutes.js'))

app.use(errorHandler);

app.listen(port, () => {
    console.log("Server started at: " + `localhost:${port}`.underline.green);
});
