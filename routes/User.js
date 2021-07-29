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

//mongodb+srv://as:abc@cluster0.ocarv.mongodb.net/astest?retryWrites=true&w=majority
fetchHistory =(req,res)=>{
  
  var HistoryList = []
      User.find({"username":req.body.username, "leave":{ $exists : false} },function(err,data){              
        for(var i =1 ;i<data.length;i++){
          var NDate = data[i].Date.split("-");
          if(NDate[1]==req.body.month){
            HistoryList.push(data[i])
          }
        }
        if(err)
        {res.status(300).json("Error")}
          else{
          var token = jwt.sign({
            data: 'foobar'
          }, 'secret', { expiresIn: "30 minute"})
          res.status(200).json({AccessToken: token,data:HistoryList})
    }
  })
}
markcorrection = (req, res) => {
  jwt.verify(req.body.token, "secret", function (err, decoded) {
    if (err) {
      err["expiredAt"] = err["expiredAt"].toLocaleString;
      res.status(300).json(err);
    }
  });
  if (req.body.Employtype == "Admin") {
    User.updateOne(
      { _id: req.body.id },
      {
        TimeIn: req.body.TimeIn,
        TimeOut: req.body.TimeOut,  
        NewTimeIn: "",
        Edit_Request: "OFF",
        NewTimeOut: "",
      },
      function (err, value) {
        var token = jwt.sign(
          {
            data: "foobar",
          },
          "secret",
          { expiresIn: "30 minute" }
        );
        res.status(204).json({ AccessToken: token });
      }
    );
  } else {
    User.updateOne(
      { _id: req.body.id },
      {
        Edit_Request: "ON",
        NewTimeIn: req.body.TimeIn,
        NewTimeOut: req.body.TimeOut,
       
        
      },
      function (err, value) {
        var token = jwt.sign(
          {
            data: "foobar",
          },
          "secret",
          { expiresIn: "30 minute" }
        );
        res.status(204).json({ AccessToken: token });
      }
    );
  }
};

Deletedata = (req, res) => {
  console.log(req.body)
  jwt.verify(req.body.token, "secret", function (err, decoded) {
    if (err) {
      err["expiredAt"] = err["expiredAt"].toLocaleString;
      res.status(300).json(err);
    } else {
      User.updateOne(
        { _id: req.body.id },
        { NewTimeIn: "", NewTimeOut: "", Edit_Request: "OFF" },
        (err, value) => {
          if (err) {
            res.status(300).json(err);
          } else {
            var token = jwt.sign(
              {
                data: "foobar",
              },
              "secret",
              { expiresIn: "30 minute" }
            );
            res.status(200).json({ AccessToken: token });
          }
        }
      );
    }
  });
};


deleterequest = (req,res)=>{

  var token = jwt.sign({
    data: 'foobar'
 }, 'secret', { expiresIn: "30 minute"})  

    User.updateOne({"_id":req.body.id},{"deleterequest":"ON"},(err,data)=>{
      if(err){
       res.status(500).json(err)
      }else
          res.status(200).json({AccessToken:token})

    })


}


module.exports= {
    fetchHistory:fetchHistory,
    markcorrection:markcorrection,
    Deletedata:Deletedata,
    deleterequest,deleterequest
}