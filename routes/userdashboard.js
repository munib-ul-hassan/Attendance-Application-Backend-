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

userDashboard = (req,res)=>{
    jwt.verify(req.headers.token, 'secret' , function(err, decoded) {
        if (err) 
          {
           err["expiredAt"] = err["expiredAt"].toLocaleString();
           res.status(300).json(err)
          }
        else 
          {
            User.find({"username":req.body.username},function(err,value){
              
              var token = jwt.sign({
                data: 'foobar'
         }, 'secret', { expiresIn: "30 minute"})
            var date = new Date().toLocaleString()
    
              res.status(200).json({auth: true, AccessToken: token, user:value, date:date}) 
            })}
    })
}
module.exports = userDashboard;