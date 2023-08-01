const mongoose = require("mongoose");

const employerSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        logo: { type: String, required: true },
        doesMatch: { type: Boolean, required: false },
        hasGrant: { type: Boolean, required: false },
        grantUrl: { type: String, required: false },
        grantAmounts: { type: Array, required: false },
        matchedAmounts: { type: Array, required: false },
    }
)

module.exports = global.usersDb.model("Employer", employerSchema);