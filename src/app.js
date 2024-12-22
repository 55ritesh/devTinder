const express = require('express');
require('./config/database');
const User = require('./models/user');

const app = express();

app.use(express.json());

app.post('/signup',async (req,res)=>{
    console.log(req.body);
    // const userObj={
    //     firstName:"Ritesh",
    //     lastName:"Kumar",
    //     emailId:"riteshk@gmail.com",
    //     password:"12345"
    // }

    const user = new User(req.body);

    try{
        await user.save();
        res.send("User added successfully");
    }catch(err){
        res.status(400).send("Err saving the user"+err.message);
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

app.patch('/user',async(req,res)=>{

    const userId=req.body.userId;
    const data=req.body;

    try{
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