const express = require('express');
require('./config/database');
const User = require('./models/user');

const app = express();

app.post('/signup',async (req,res)=>{
    const userObj={
        firstName:"Ritesh",
        lastName:"Kumar",
        emailId:"riteshk@gmail.com",
        password:"12345"
    }

    const user = new User(userObj);

    try{
        await user.save();
        res.send("User added successfully");
    }catch(err){
        req.status(400).send("Err saving the user"+err.message);
    }
    
})




app.listen(3000,()=>{
    console.log("server is listening on port 3000...")
});