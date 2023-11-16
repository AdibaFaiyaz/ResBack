const express = require("express");
const peopleSchema = require("../model/peopleSchema");
const people = express.Router();
const mongoose = require("mongoose");

people.post("/create-people",(req,res)=>{
   const entry = req.body;
    peopleSchema.create(entry,(err,data)=>{
        if(err)
            return err;
        
        else
            res.json(data);
        
    })
})


people.get("/",(req,res)=>{
    peopleSchema.find((err,data)=>{
        if(err){
            return err;
        }
        else{
            res.json(data);
        }

    })
})


people.route("/update-people/:id").get((req,res)=>{
    peopleSchema.findById(mongoose.Types.ObjectId(req.params.id),(err,data)=>{
        if(err){
            return err;
        }
        else{
            res.json(data);
        }
    })
}).put((req,res)=>{
    peopleSchema.findByIdAndUpdate(mongoose.Types.ObjectId(req,params.id),{$set:req.body},(err,data)=>{
        if(err){
            return err;
        }
        else{
            res.json(data);
        }
    })
})


people.delete("/delete-people/:id",(req,res)=>{
    peopleSchema.findByIdAndRemove(mongoose.Types,ObjectId(req.params,id),(err,data)=>{
        if(err){
            return err;
        }
        else{
            res.json(data);
        }
    })
})


module.exports = people;