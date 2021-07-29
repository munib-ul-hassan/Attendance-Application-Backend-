var body = require('body-parser');
const mongoose = require('mongoose');
var mongodb = require('mongodb')
//var url = 'mongodb://localhost:27017/Mongodb'
var express = require('express');
var app = express();
app.use(body.json());
const User = require('../connection');
var bcrypt = require('bcrypt');
var CryptoJS = require("crypto-js")
var jwt = require('jsonwebtoken');
var dateformat = require("dateformat")

login = (req, res, next) => {
  User.find({ "username": req.body.username }, function (err, data) {

    if (err) {
      res.status(400).json("unspecified name")
      return;
    }
    else if(err){
      res.status(404).json("Connection error");
    }
    else {
      if (data.length <= 0) {
        res.status(400).json({
          "message": "Invalid Input!"
        })
      }
      else {
        //bcrypt.compare(req.body.password,data[0].password).then(function(result) {
        var bytes = CryptoJS.AES.decrypt(data[0].password, 'my-secret-key@123');
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        if (req.body.password == decryptedData) {
          
          var token = jwt.sign({
            data: 'foobar'
          }, 'secret', { expiresIn: "30 minute" })
          
          console.log(req.body.date)
          User.find({ "username": req.body.username, "Date": req.body.date }, function (err, value) {
            if (err) {
              res.status(400).json("unspecified name")
              return;
            }
            else{
              let count = value.length-1
            let timein = false

            if (value.length>0) {
              timein = true;
            }
            res.status(200).json({ auth: true, AccessToken: token, User: data[0], timeinStatus: timein, data: value[count],});
          
          }
          })
 
          //res.status(200).json({auth: true,  AccessToken:token,  User:data[0], timeIn: timein}) 
        }
        else {
          res.status(300).json({
            "message": "Input!"
          })
        }

        //  });

      }
    }
  })
}
module.exports = login;