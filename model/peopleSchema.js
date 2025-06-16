const mongoose = require("mongoose");
const peopleSchema = new mongoose.Schema({
    "email": {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    "password": {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    },
},{
    collection: "people",
    timestamps: true
})

module.exports = mongoose.model("peopleSchema",peopleSchema);