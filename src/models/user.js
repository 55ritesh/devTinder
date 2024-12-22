
const mongoose = require('mongoose');
const validator = require('validator');

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
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address"+value);
            }
        }
    },
    password:{
        type: String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password"+value);
            }
        }
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
        type:[String],
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter valid URL"+value);
            }
        }
    },
    skills:{
        type:[String]
    }
},{timestamps:true})

const User = mongoose.model("User",userSchema);

module.exports=User;