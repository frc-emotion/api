const mongoose = require("mongoose");

const usersSchema = mongoose.Schema(
    {
        firstname: {type: String},
        lastname: {type: String},
        username: {type: String},
        email: {type: String},
        password: {type: String},
        isAdmin: {type: String},
        isVerified: {type: String},
    },
    {
        timestamps: true,
    }
);

module.exports = global.usersDb.model('User', usersSchema);;
