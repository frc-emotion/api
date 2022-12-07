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
connectDB();

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

app.use(`${api}/users`, require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(port, () => {
    console.log("Server started at: " + `localhost:${port}`.underline.green);
});
