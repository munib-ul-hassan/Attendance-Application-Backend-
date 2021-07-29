var body = require('body-parser');
const mongoose = require('mongoose');
var mongodb = require('mongodb')
var localhost_url = 'mongodb://localhost:27017/Mongodb'
var heroku_url='mongodb+srv://as:abc@cluster0.ocarv.mongodb.net/astest?retryWrites=true&w=majority'
var express = require('express');
var app = express();
app.use(body.json());
var bcrypt = require('bcrypt');
var CryptoJS = require("crypto-js")
var jwt = require('jsonwebtoken');
const router= express.Router()
const User = require('./connection');
mongoose.connect(localhost_url, { useUnifiedTopology: true, useNewUrlParser: true },function(err){
  if(err){
    console.log(err)
  }else{
    console.log("connection Successful")
  }
})


// router.get('/Dashboard', (req, res) => {
//   res.send('Hello World')
// })

function checkToken(req,res,result){
  const header= req.body.token;
  if(typeof header !== 'undefined'){
    const bearer =header.split('.');
    const token = bearer[1]
    //console.log(token)
    req.token = token 
    //next();
    result();
  }else
  res.json("Error")
  }  

const login = require('./routes/login')
app.post("/login", async (req, res, next) => {
  console.log("login api hit")
  login(req,res,next)
  } )  

  
 

  //dashboard work is merged with login api
// const userDashboard = require('./routes/userdashboard')
// app.post("/Dashboard",checkToken,(req,res)=>  {
//   userDashboard(req,res);
// }) 

const  TimeIn = require('./routes/TimeInTimeOut')
app.post("/TimeIn",checkToken,function(req,res){
  console.log("api hit")
  TimeIn.TimeIn(req,res)    
}) 


app.post("/TimeOut" ,checkToken, function(req,res){
   console.log("Time out")
   TimeIn.TimeOut(req,res) 
})


app.post("/WorkingHours",checkToken,function(req,res){
  console.log("api hit")
  TimeIn.WorkingHours(req,res)    
}) 


const Records = require('./routes/User')
app.post("/fetchHistory",function(req,res){
  console.log("Fetch History")
  Records.fetchHistory(req,res)
})
app.put('/markCorrectionTime',checkToken,(req,res)=>{
  console.log(req.body)    
  Records.markcorrection(req,res)

})
app.post("/DeleteData",checkToken,(req,res)=>{
  console.log(req.body)
  Records.Deletedata(req,res)
})

app.post("/deleterequest",checkToken,(req,res)=>{
  console.log("deleterequest")
  Records.deleterequest(req,res);
})


  const leaves = require('./routes/leaves')
  app.post("/Leaverequest",(req,res)=>{
    console.log("Leave Request");
    leaves.leaverequest(req,res);
  })

  app.post("/fetchLeavesHistory",checkToken,function(req,res){
    console.log("fetchLeaveHistory")
    leaves.leaveshistory(req,res);  
    })
  

  app.post("/logout",checkToken, function(req,res){
    jwt.verify(req.headers.token, 'secret' , function(err, decoded){
    if(err) {
      //err["expiredAt"] = err["expiredAt"].toLocaleString();
      res.status(300).json(err)
    }else      
      res.status(200).json("logout Successfull")     
    })
  })


const CreateUser = require('./routes/create user')
app.post("/userData",(req,res)=>{
  console.log("UserData")
  CreateUser(req,res)
})
const manages = require('./routes/manages')
  app.post("/user/FetchHistory",checkToken,(req,res)=>{
    console.log("User/FetchHistory")
    manages.fetchHistory(req,res);
   
  })

  app.post("/correctWorkingHours",checkToken,(req,res)=>{
    manages.correctWorkingHours(req,res);
   
  })

  
app.post('/approveleaverequest',checkToken,(req,res)=>{
  console.log(req.body);
  manages.approveRequest(req,res)
})
app.post('/deleteleaverequest',checkToken,(req,res)=>{
  manages.deleteRequest(req,res)

})



  app.post("/adminDashboard",(req,res)=>{
    console.log("admin")
    console.log(req.body.username)  
  //  jwt.verify(req.headers.token, 'secret' , function(err, decoded){
  //   if(err) {
      
  //     res.status(300).json(err)
  //   }})
  //   var token = jwt.sign({
  //     data: 'foobar'
  //  }, 'secret', { expiresIn: "10 minute"})  
  
  
   if(req.body.username==""){
    console.log(req.body)
    User.find({"TimeIn":""},(err,data)=>{
      //res.status(200).json({name:data[0].username,data:data,AccessToken:token})
      res.status(200).json({data:data})    
      return;    
   })
    
   }else{
    User.find({"username":req.body.username,"Date":""},(err,data)=>{
     
      res.status(200).json({data:data})
      return ;
     //res.status(200).json({name:data[0].username,data:data,AccessToken:token})   
      })
  }
    
  })


  app.post("/DleteUser",(req,res)=>{
      console.log("Delete data")
      User.deleteOne({"_id":req.body.id},(err,res)=>{
        if(err){
          console.log(err)
        }})
  })
  var managerid = require('./routes/user/getManagerID') 
  app.post('/GetManagerId',(req,res)=>{
    managerid(req,res)
  }) 
  
  
  app.get('/calculateleaves',(req,res)=>{
    
  })
  const PORT = process.env.PORT || 8000
  app.listen(PORT, function(){
 
    console.log("Server is running")
    
  })


