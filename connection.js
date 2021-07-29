const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
    
    username : String,
    password : String,    
    email: String,
    age : String,
    gender: String,
    Date: String,
    TimeIn: String,
    DOB : String,
    Manager :String,
    PhoneNo:String,
    EmergencyNo:String,
    experience:String,
    education:String,
    designation:String,
    TimeOut: String,
    deleterequest: String,
    NewTimeIn: String,
    NewTimeOut: String,
    Employ_Type: String,
    manager_id: String,
    Totaltime:String,
    leave:String,
    fromdate: String,
    todate: String,
    code:String,
    description: String,
    type:String,
    Edit_Request:String,
    Type:String,
    WorkingHours:String
});
    
    
module.exports = mongoose.model('mongodb',Schema)

