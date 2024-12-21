const express = require('express');

const app = express();

// app.get("/user",(req,res)=>{
//     res.send({firstName:"Akshay",lastName:"Kumar"});
// })

app.use("/hello",(req,res,next)=>{
    console.log("Hello");
    next();
    res.send("Hello hello hello....");
  
},(req,res)=>{
    console.log("Hello world");
    res.send("Hello .....");
},(req,res)=>{
    console.log("hello nhi karna hai");
})



app.listen(3000,()=>{
    console.log("server is listening on port 3000...")
});