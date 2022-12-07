const mongoose = require("mongoose");

const connectDB = (dbUrl) => { 
    try {
        const conn = mongoose.createConnection(dbUrl)
        return conn
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;