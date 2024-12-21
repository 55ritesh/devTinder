
const mongoose = require('mongoose');

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://nprvk7:Aqs4Tck4rupBQuh3@namastenode.dzkiq.mongodb.net/");
};

connectDB()
     .then(()=>{
        console.log("database connection established...");
     })
     .catch((err)=>{
        console.error("database connection not established");
     });