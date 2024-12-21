const express = require('express');

const app = express();

const {adminAuth,userAuth} = require('./middlewares/auth');

//Handle auth middleware for all GET,POST.... request
app.use("/admin",adminAuth);

// app.use("/user",(req,res)=>{
//     res.send("user Data send");
// })


app.use("/user",userAuth,(req,res)=>{
    res.send("user Data send");
})

app.get("/admin/getAllData",(req,res)=>{
    res.send("All data sent");
});

app.get("/admin/deleteAllUser",(req,res)=>{
    res.send("Deleted a user");
});




app.listen(3000,()=>{
    console.log("server is listening on port 3000...")
});