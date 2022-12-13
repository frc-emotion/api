const mongoose = require("mongoose");

const usersSchema = mongoose.Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = global.usersDb.model('User', usersSchema);;
