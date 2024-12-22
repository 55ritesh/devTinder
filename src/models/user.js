
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required:true,
        minLength:4,
        maxLength:50
    },
    lastName:{
        type: String
    },
    emailId:{
        type: String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type: String,
        required:true
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Gender data is not validated");
            }
        }
    },
    about:{
       type:String,
       default:"Default description"
    },
    photoUrl:{
        type:[String]
    },
    skills:{
        type:[String]
    }
},{timestamps:true})

const User = mongoose.model("User",userSchema);

module.exports=User;