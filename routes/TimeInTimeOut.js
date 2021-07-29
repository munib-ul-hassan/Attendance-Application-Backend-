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
var dateformat = require("dateformat")

const convertTime12to24 = time12h => {
  const [a,time, modifier] = time12h.split(" ");
 
  let [hours, minutes] = time.split(":");
 
  if (hours === "12") {
    hours = "00";
  }
 
  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }
 
  return `${hours}:${minutes}`;
};
TimeIn=(req,res)=>{
    jwt.verify(req.body.token, 'secret' , function(err, decoded) {
        if (err) 
        {
         err["expiredAt"] = err["expiredAt"].toLocaleString();   
         res.status(300).json(err)
        }else{
        
      let today = new Date() 
      Today = today.toLocaleString();
      var date = Today.split(",")
      var  document = new User();
      
      User.find({"username":req.body.username},function(err,data){
   
        
      
        date[1]= convertTime12to24(date[1])
        
      var da = dateformat(date[0],"yyyy-mm-dd")
      // console.log(da);
      document.username= data[0].username;
      document.Date = da;
      document.TimeIn = date[1];
      document.TimeOut = "";
      document.WorkingHours="0";
      document.manager_id= data[0].manager_id,
      document.code = data[0].code
      document.save();
      console.log(document);
      
      var token = jwt.sign({
        data: 'foobar'
    }, 'secret', { expiresIn: "30 minute"})
    // console.log(date[1])
      res.status(200).json({auth: true, AccessToken: token ,TimeIn:date[1],WorkingHours:"0"})
      })
    }
    })
}

TimeOut = (req,res)=>{
  
  let today = new Date() 
  Today = today.toLocaleString();
  var date = Today.split(",")
  date[0]= dateformat(date[0],"yyyy-mm-dd")
  jwt.verify(req.body.token, 'secret' , function(err, decoded) {
    if(err) {
     err["expiredAt"] = err["expiredAt"].toLocaleString();
     res.status(300).json(err)
    }
    else
      {
  User.find({"username":req.body.username,"Date":date[0]},function(err,data){
    console.log(req.body)
    date[1]= convertTime12to24(date[1])


    User.updateOne({"username":req.body.username, "Date":date[0],"TimeIn":req.body.TimeIn, "WorkingHours":"0"}, {"TimeOut": date[1]},function(err,dat){
      if(err)   
        res.json("You Last login Yesterday");
      else  
        {
          var token = jwt.sign({
            data: 'foobar'
     }, 'secret', { expiresIn: "30 minute"})
     
    res.status(200).json({auth: true, AccessToken: token, TimeOut: date[1]})
        }
        })}) 
}})}

WorkingHours = (req,res)=>{
  
  let today = new Date() 
  Today = today.toLocaleString();
  var date = Today.split(",")
  date[0]= dateformat(date[0],"yyyy-mm-dd")
  jwt.verify(req.body.token, 'secret' , function(err, decoded) {
    if(err) {
     err["expiredAt"] = err["expiredAt"].toLocaleString();
     res.status(300).json(err)
    }
    else
      {
  User.find({"username":req.body.username,"Date":date[0]},function(err,data){
    console.log(req.body)

    User.updateOne({"username":req.body.username, "Date":date[0],"TimeIn":req.body.TimeIn,"TimeOut":req.body.TimeOut}, {"WorkingHours":req.body.WorkingHours},function(err,dat){
      if(err)   
        res.json("You Last login Yesterday");
      else  
        {
          var token = jwt.sign({
            data: 'foobar'
     }, 'secret', { expiresIn: "30 minute"})
     
    res.status(200).json({auth: true, AccessToken: token, TimeOut: date[1],WorkingHours:req.body.WorkingHours})
        }
        })}) 
}})}




module.exports = {
    TimeIn: TimeIn,
    TimeOut: TimeOut,
    WorkingHours: WorkingHours};
//module.exports = TimeOut;