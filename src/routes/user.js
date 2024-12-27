const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const { set } = require('mongoose');
const User = require('../models/user');

const userRouter = express.Router();

// get all the pending connection request for logged in user
userRouter.get("/user/requests/received",userAuth,async (req,res)=>{

    try{

        const loggedInUser = req.user;

        const connectionRequestModel = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName"]);

        res.json({
            message:"Data fetched successfully",
            data: connectionRequestModel
        })
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
})


userRouter.get("/user/connections",userAuth,async (req,res)=>{

    try{

        const loggedInUser = req.user;

        const connectionRequestModel = await ConnectionRequestModel.find({
            $or:[
                {toUserId: loggedInUser._id,status:"accepted"},
                {fromUserId: loggedInUser._id,status:"accepted"}
            ]
        }).populate("fromUserId",["firstName","lastName"]).populate("toUserId",["firstName","lastName"]);

        const data = connectionRequestModel.map(row=>{

            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
           return row.fromUserId
    });

        res.json({
            message:"successful",
            data: data
        })
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
})


userRouter.get("/feed",userAuth,async (req,res)=>{
 // /feed?page=2&limit=10

    try{

       //User should see all the user card except
       // his own card
       // his connections
       // ignored people
       // already sent the connection request

       const loggedInUser = req.user;

       // pagination

       const page = parse(req.query.page) || 1;
       let limit = parse(req.query.limit) || 10;
       limit = (limit>50)?50:limit;
       const skip = (page-1)*limit;

       // find all connection requests(sent+received)

       const connectionRequestModel = await ConnectionRequestModel.find({
        $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}],
       }).select("fromUserId toUserId");



        const hideUserFromFeed=new Set();
        connectionRequestModel.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });


        const users = await User.find({
            $and:[
            {_id:{$nin: Array.from(hideUserFromFeed)}},
            {_id:{$ne:loggedInUser._id}}
            ]
        }).select("firstName lastName photoUrl skills about").skip(skip).limit(limit);


       res.send(users);


    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
})

module.exports=userRouter;