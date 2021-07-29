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

fetchHistory = (req,res)=>{
    User.find({"username":req.body.username},(err,data)=>{
      if(data.length>0){
        //console.log(data[0]._id)
        if(req.body.leaves=="ON"){
            User.find({"manager_id":data[0].code,"leave":"OFF"},(err,Value)=>{

              var token = jwt.sign({
                    data: 'foobar'
                  }, 'secret', { expiresIn: "30 minute"})
                  res.status(200).json({AccessToken:token,data:Value})        
            })
        }else{
        User.find({"manager_id":data[0].code,"Edit_Request":"ON"},(err,Value)=>{
          
            console.log(Value)
              var token = jwt.sign({
              data: 'foobar'
              }, 'secret', { expiresIn: "30 minute"})
            res.status(200).json({AccessToken:token,data:Value})
      })
    }
  }
 
})
}



approveRequest = (req,res)=>{
  console.log("approve")
  console.log(req.body.id)
    User.updateOne({"_id":req.body.id},{"leave":"ON"},(err,res)=>{
        if(err)
          res.json("Munib")
    })
          var token = jwt.sign({
            data: 'foobar'
         }, 'secret', { expiresIn: "30 minute"})  
          res.status(200).json({AccessToken:token})
    }

deleteRequest= (req,res)=>{
  console.log("delete");
    User.deleteOne({"_id":req.body.id},(err,res)=>{
        if(err)
          console.log(err)
    })
          var token = jwt.sign({
            data: 'foobar'
         }, 'secret', { expiresIn: "30 minute"})  
          res.status(200).json({AccessToken:token})
      
}

correctWorkingHours = (req,res)=>{
  
  // let today = new Date() 
  // Today = today.toLocaleString();
  // var date = Today.split(",")
  // date[0]= dateformat(date[0],"yyyy-mm-dd")
  jwt.verify(req.body.token, 'secret' , function(err, decoded) {
    if(err) {
     err["expiredAt"] = err["expiredAt"].toLocaleString();
     res.status(300).json(err)
    }
    else
      {
  User.find({"username":req.body.username,_id: req.body.id},function(err,data){
    console.log(req.body)

    User.updateOne({"username":req.body.username,"TimeIn":req.body.TimeIn,"TimeOut":req.body.TimeOut, _id: req.body.id}, {"WorkingHours":req.body.WorkingHours},function(err,dat){
      if(err)   
        res.json("You Last login Yesterday");
      else  
        {
          var token = jwt.sign({
            data: 'foobar'
     }, 'secret', { expiresIn: "30 minute"})
     
    res.status(200).json({auth: true, AccessToken: token,WorkingHours:req.body.WorkingHours})
        }
        })}) 
}})}

module.exports = {
    fetchHistory:fetchHistory,
    approveRequest:approveRequest,
    deleteRequest:deleteRequest,
    correctWorkingHours:correctWorkingHours
  };
