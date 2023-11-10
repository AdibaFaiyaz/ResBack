const mongoose = require("mongoose");
const peopleSchema = new mongoose.Schema({
    "email": {type:String},
    "password": {type:String},
},{
    collection: "people"
})

module.exports = mongoose.model("peopleSchema",peopleSchema);