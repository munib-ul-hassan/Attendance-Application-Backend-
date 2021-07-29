var body = require('body-parser');
const mongoose = require('mongoose');
var mongodb = require('mongodb')
var url = 'mongodb://localhost:27017/Mongodb'
var express = require('express');
var app = express();
app.use(body.json());
const User = require('../connection');

var bcrypt = require('bcrypt');
var CryptoJS = require("crypto-js")
var jwt = require('jsonwebtoken');


const CreateUser = (req,res)=>{
  console.log("UserData")
    var hash = CryptoJS.AES.encrypt(JSON.stringify(req.body.password), 'my-secret-key@123').toString();

    // User.updateOne({"username":req.body.fullName},{
    //   "email":req.body.email,
    //   "age": req.body.age,
    //   "gender":req.body.gender,
    //   "DOB":req.body.dob,
    //   "education":req.body.education,
    //   "experience":req.body.experience,
    //   "manager_id":req.body.manager_id,
    //   "password":hash
    // },(err,data)=>{
    //   if(err)
    //     console.log("Error Occured!")
    //   else  
    //     console.log("Succesfully update");
    // })
    //User.updateOne({"username":req.body.username,Date:""},{})
    var document = new User()
    var hash = CryptoJS.AES.encrypt(JSON.stringify(req.body.password), 'my-secret-key@123').toString();
    document.username = req.body.fullName;
    document.email = req.body.email
    document.age = req.body.age 
    document.gender = req.body.gender
    document.DOB = req.body.dob
    document.education = req.body.education
    document.experience = req.body.experience
    document.designation = req.body.designation
    document.code = req.body.id
    document.manager_id = req.body.managerid
    document.Date = ""
    document.password = hash
    document.save();   
   
    
    var token = jwt.sign({
      data: 'foobar'
    }, 'secret', { expiresIn: "30 minute"})
    res.status(200).json({AccessToken:token})
}
module.exports = CreateUser;