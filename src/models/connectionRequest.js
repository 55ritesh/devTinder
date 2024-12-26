
const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
        
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignore","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`
        }
    }
},
{
    timestamps:true,
}
);


connectionRequestSchema.pre("save",function(next){

    const connectionRequest=this;

    //check if from userid same as touserid

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You cannot send connection request to yourself");
    }
    next();
})


const ConnectionRequestModel = new mongoose.model("ConnectionRequestModel",connectionRequestSchema);

module.exports = ConnectionRequestModel;