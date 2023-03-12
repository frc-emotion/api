const mongoose = require("mongoose");
mongoose.set('debug', true);
const connectDB = (dbUrl) => { 
    try {
        return mongoose.createConnection(dbUrl)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;