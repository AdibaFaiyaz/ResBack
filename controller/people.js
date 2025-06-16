const express = require("express");
const peopleSchema = require("../model/peopleSchema");
const people = express.Router();
const mongoose = require("mongoose");

people.post("/create-people", async (req,res)=>{
   try {
       const entry = req.body;
       const data = await peopleSchema.create(entry);
       res.json(data);
   } catch (err) {
       res.status(400).json({ error: err.message });
   }
})

// Login endpoint
people.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await peopleSchema.findOne({ email, password });
        if (user) {
            res.json({ success: true, message: "Login successful", user });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})


people.get("/", async (req,res)=>{
    try {
        const data = await peopleSchema.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})


people.route("/update-people/:id").get(async (req,res)=>{
    try {
        const data = await peopleSchema.findById(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}).put(async (req,res)=>{
    try {
        const data = await peopleSchema.findByIdAndUpdate(req.params.id, {$set:req.body}, {new: true});
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})


people.delete("/delete-people/:id", async (req,res)=>{
    try {
        const data = await peopleSchema.findByIdAndRemove(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})


module.exports = people;