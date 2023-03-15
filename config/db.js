const mongoose = require("mongoose");
const connectDB = (dbUrl) => { 
    try {
        return mongoose.createConnection(dbUrl)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;