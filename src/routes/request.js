const express = require('express');
const {userAuth} = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');

const requestRouter = express.Router();


requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{

    try{

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored","interested"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Invalid status type "+status
            })
        }


        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ],
        });

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({message:"Connection Request already exist!!"});
        }


        if(existingConnectionRequest){
            return res.status(400).json({message:"User not found.."});
        }

        const connectionRequestModel = new ConnectionRequestModel({
            fromUserId,toUserId,status,
        });

        const data = await connectionRequestModel.save();

        res.json({
            message:req.user.firstName+" is "+status + " by "+toUser.firstName,
            data,
        })
    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }

  //  res.send(User.firstName+" sent the connection request");
  
})



requestRouter.post("/request/review/:status/:requestId",userAuth,async (req,res)=>{

    try{
         
        const loggedInUser = req.user;
        const {status,requestId} = req.params;

        //validate the user
        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"status is not allowed"});
        }

        
        const connectionRequest = await ConnectionRequestModel.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested",
        });

        if(!connectionRequest){
            return res
            .status(404)
            .json({message:"Connection request not found"});
        }
        
        // modify the status
        connectionRequest.status=status;
        //save
        const data=await connectionRequest.save();

        res.json({message:"Connection request "+status,data});


    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
})


module.exports=requestRouter;