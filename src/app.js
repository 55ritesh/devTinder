const express = require('express');
require('./config/database');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);



app.listen(3000,()=>{
    console.log("server is listening on port 3000...")
});