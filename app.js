const express = require('express');
require('dotenv').config()
const User = require('./model/user')
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.send("<h1>hello from auth system</h1>");
})

app.post("/register",(req,res)=>{
    const {firstName,lastName,email,password} = req.body;
    if(!(email && password && firstName && lastName)){
        res.status(400).send("All fields is required");
    }
    const existingUser = User.findOne({email})
})

module.exports = app;
