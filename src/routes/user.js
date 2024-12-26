const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');

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

module.exports=userRouter;