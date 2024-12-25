const express = require('express');
require('./config/database');
const User = require('./models/user');
const {validateSignUpData} = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/auth');

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

    // const isPasswordValid = await bcrypt.compare(password,user.password);

    const isPasswordValid = await user.validatePassword(password);

    if(isPasswordValid){

      // Create JWT token

     // const token = await jwt.sign({_id:user._id},"DEVTinder@5678");

     const token  = await user.getJWT();
     // console.log(token);



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


app.get('/profile',userAuth,async (req,res)=>{
    try{

  const user = req.user;
    res.send(user);
   }
   catch(err){
    res.status(400).send("ERROR: "+err.message);
   }
})



app.post("/sendConnectionRequest",userAuth,(req,res)=>{

    const user=req.user;
    //sending a connection request
    console.log("sending a connection request");

    res.send(user.firstName+" sent the connection request");
})


app.listen(3000,()=>{
    console.log("server is listening on port 3000...")
});