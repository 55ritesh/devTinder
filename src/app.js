const express = require('express');
require('./config/database');
const User = require('./models/user');
const {validateSignUpData} = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/signup',async (req,res)=>{
    // console.log(req.body);
    // const userObj={
    //     firstName:"Ritesh",
    //     lastName:"Kumar",
    //     emailId:"riteshk@gmail.com",
    //     password:"12345"
    // }

    try{
    // validation of data
     validateSignUpData(req);
  
    // encrypt the password

    const {firstName,lastName,emailId,password}=req.body;
    const passwordHash = await bcrypt.hash(password,10);
    // console.log(passwordHash);

    // create new instance of user model
   // const user = new User(req.body);

    const user = new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash,
    });

    
        await user.save();
        res.send("User added successfully");
    }catch(err){
        res.status(400).send("ERROR:"+err.message);
    }
    
})


//login api

app.post('/login',async (req,res)=>{
      try{
    const {emailId,password} = req.body;

    const user = await User.findOne({emailId:emailId});

    if(!user){
        throw new Error("Invalid credential");
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(isPasswordValid){

      // Create JWT token

      const token = await jwt.sign({_id:user._id},"DEVTinder@5678");
      console.log(token);



   // add token to cookie and send response back to user
        res.cookie("token",token);
        res.send("Login successful");
    }else{
        throw new Error("Invalid credential");
    }
   }
   catch(err){
    res.status(400).send("ERROR: "+err.message);
   }
})


app.get('/profile',async (req,res)=>{
    try{
    const cookies=req.cookies;

    const {token}=cookies;
    //validate my token

    if(!token){
        throw new Error("Invalid Token");
    }
    
    const decodedMessage = await jwt.verify(token,"DEVTinder@5678");
    console.log(decodedMessage);

    const {_id} = decodedMessage;
    console.log("logged in user id:"+ _id);

  //  console.log(cookies);

  const user = await User.findOne({_id});
  if(!user){
    throw new Error("User does not exist");
  }
    res.send(user);
   }
   catch(err){
    res.status(400).send("ERROR: "+err.message);
   }
})



// Feed API - GET /feed - get all the users for the database
app.get('/feed',async (req,res)=>{

    try{
        const users=await User.find({});
        res.send(users);
    }catch(err)
    {
        res.status(400).send("something went wrong");
    }
})


// Delete a user from the database
app.delete('/user',async (req,res)=>{
    const userId = req.body.userId;

    try{
        
        const user=await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");
    }catch(err)
    {
        res.status(400).send("something went wrong");
    }
})

// Update data of a user 

app.patch('/user/:userId',async(req,res)=>{

  //  const userId=req.body.userId;
  const userId=req.params?.userId;
    const data=req.body;

    try{

        const ALLOWED_UPDATES=[
            "photoUrl","about","gender","age","skills"
        ];

        const isUpdateAllowed = Object.keys(data).every((k)=>
            ALLOWED_UPDATES.includes(k)
    );

    if(!isUpdateAllowed){
        throw new Error("Update not allowed");
    }

    if(data?.skills.length>10){
        throw new Error("Skills cannot be more than 10");
    }

        await User.findByIdAndUpdate({_id:userId},data);
        res.send("User updated successfully");
    }catch(err)
    {
        res.status(400).send("something went wrong");
    }
})


app.listen(3000,()=>{
    console.log("server is listening on port 3000...")
});