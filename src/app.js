const express = require('express');

const app = express();

app.get("/user",(req,res)=>{
    res.send({firstName:"Akshay",lastName:"Kumar"});
})

app.use("/hello",(req,res)=>{
    res.send("Hello hello hello....");
})



app.listen(3000,()=>{
    console.log("server is listening on port 3000...")
});