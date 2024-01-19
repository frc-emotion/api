const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
	{
		firstname: { type: String, required: true, trim: true },
		lastname: { type: String, required: true, trim: true },
		username: { type: String, required: true, unique: true, trim: true },
		email: { type: String, required: true, unique: true, trim: true },
		password: { type: String, required: true },
		phone: { type: String, required: false, unique: true },
		subteam: { type: String, required: false }, //"software" | "build" | "executive" | "marketing" | "electrical" | "design"
		grade: { type: Number, required: false },
		roles: { type: Array, required: true },
		accountType: { type: Number, required: true, default: 0 },
		accountUpdateVersion: { type: Number, required: true },
		forgotPassword: { type: Object, required: false },
		// forgotPassword: {
		// code: { type: String },
		// expiresAt: { type: Number },
		// },
		rateLimit: { type: Object, required: false },
		// rateLimit: {
		// count: Number,
		// expiresAt: Number,
		// },
		socials: { type: Array, required: false },

		parents: { type: Array, required: false },
		attendance: { type: Array, required: false }, //array of attendance objects, sorted by semester with 0 = 2023 fall

		children: { type: Array, required: false },
		spouse: { type: Object, required: false },
		donationAmounts: { type: Array, required: false },
		employer: { type: Object, required: false },

		// temporary while transitioning from v1 to v2
		isVerified: { type: Boolean, required: false },
		isAdmin: { type: Boolean, required: false },
	},
	{
		timestamps: true,
	}
);

module.exports = global.usersDb.model("User", userSchema);
