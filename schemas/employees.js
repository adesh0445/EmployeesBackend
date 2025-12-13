const mongoose=require("mongoose")
const employeeSchema= new mongoose.Schema({
    fullname:{
        type:String
    },
    phone:{
        type:String
    },
    email:{
        type:String
    },
    jobtype:{
        type:String
    },
    salary:{
        type:String
    },
    gender:{
        type:String
    },
    address:{
        type:String
    }
});
const employeesModel = mongoose.model("EmployeesData",employeeSchema);
module.exports=employeesModel;