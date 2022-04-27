const express = require('express');
require('dotenv').config()
require('./config/database').connect()
const User = require("./model/user")
const bcrypt = require('bcryptjs');
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.send("<h1>hello from auth system</h1>");
})

app.post("/register",async (req,res)=>{
    const {firstName,lastName,email,password} = req.body;
    if(!(email && password && firstName && lastName)){
        res.status(400).send("All fields is required");
    }
    const existingUser = await User.findOne({email})
    if(existingUser){
        res.status(400).send("User already exists");
    }

    const myEncPassword = await bcrypt.hash(password,10)
    const user = User.create({
        firstName,
        lastName,
        email:email.toLowerCase(),
        password:myEncPassword
    })
})

module.exports = app;
