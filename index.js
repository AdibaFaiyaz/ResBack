require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const people = require("./controller/people");
const bookings = require("./controller/bookings");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

mongoose.set("strictQuery",true);
const mongoUri = process.env.MONGO_URI || "mongodb+srv://adibafaiyaz16:12345@perdetails.r9gaoey.mongodb.net/login";
mongoose.connect(mongoUri)
var db = mongoose.connection;
db.on("open",()=>console.log("Connected to DB"));
db.on("error",()=>console.log("Error occured"))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

app.use("/people",people);
app.use("/bookings",bookings);

const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`);
})