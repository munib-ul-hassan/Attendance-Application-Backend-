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
var dateformat = require('dateformat')


leaveshistory = (req, res) => {
  jwt.verify(req.body.token, "secret", function (err, decoded) {
    if (err) {
      res.status(300).json(err);
    } else {
      User.find(
        { username: req.body.username, leave: "ON" },
        function (err, data) {
          if (err) {
            res.status(300).json("Error");
          } else {
            var token = jwt.sign(
              {
                data: "foobar",
              },
              "secret",
              { expiresIn: "30 minute" }
            );
            res.status(200).json({ AccessToken: token, data: data });
          }
        }
      );
    }
  });
};
leaverequest = (req,res)=>{
  jwt.verify(req.body.token, 'secret' , function(err, decoded){
      if(err) {
        res.status(300).json(err)
      }
      else{
        if(req.body.id){
          User.updateOne({"_id":req.body.id},{"description":req.body.description,"type":req.body.type,"leave":"OFF"},function(err,data){
            if(err)
            res.status(300).json(err)
          })
        }
        else
        {
          console.log(req.body)
        User.find({"username":req.body.username},(err,data)=>{
        let today = new Date() 
        Today = today.toLocaleString();
        console.log(Today);
        var date = Today.split(",")
        console.log(date);
        let document = new User()
        document.username = req.body.username;
        document.Date= dateformat(date[0],"yyyy-mm-dd");
        document.description= req.body.Description;
        document.type = req.body.leavetype;
        document.fromdate = dateformat(req.body.fromdate,"yyyy-mm-dd");
        document.todate = dateformat(req.body.todate,"yyyy-mm-dd");
        document.manager_id= data[0].manager_id;
        document.leave= "OFF";
        document.save()
        })
        var token = jwt.sign({
          data: 'foobar'
        }, 'secret', { expiresIn: "30 minute"})
        res.status(200).json({AccessToken: token})}
      }
      
      
  })
}

module.exports = {
    leaverequest:leaverequest,
    leaveshistory:leaveshistory
}
