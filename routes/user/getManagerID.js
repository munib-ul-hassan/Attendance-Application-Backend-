var body = require('body-parser');
const mongoose = require('mongoose');
var mongodb = require('mongodb')
var url = 'mongodb://localhost:27017/Mongodb'
var express = require('express');
var app = express();
app.use(body.json());
const User = require('../../connection');

var bcrypt = require('bcrypt');
var CryptoJS = require("crypto-js")
var jwt = require('jsonwebtoken');

var managerid= (req,res)=>{
    console.log("Munib");
    User.find({"Manager":"Yes"},(err,data)=>{
        var counter = data.length
        var username =[]
        for(var i=0;i<counter;i++ )
        {
            username[i]= data[i].username
        }
        res.send(username)
        
    })
}

module.exports= managerid;