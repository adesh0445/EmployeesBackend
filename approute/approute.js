const express=require('express');
const myapp=express.Router();

myapp.get("/",(req,res)=>{
res.send("<div><h1>This deault express page  yes</h1></div>")
})

const appmenu=require("../schemas/appmenu")
myapp.get("/applist",async (req,res)=>{
    const appdata=await appmenu.find();
    res.send({status:250,applist:appdata})
})    

const User=require('../schemas/user')
myapp.get('/userlist',async (req,res)=>{
    const Userdata= await User.find();
    res.send({status:250,userlist:Userdata})
});

const Employees=require("../schemas/employees")
myapp.get("/Employeeslist",verifyAuth,async (req,res)=>{
  const EmployeesData=await Employees.find();
  res.send({status:250,Employeeslist:EmployeesData})
})

// myapp.post("/Registerpage", async (req, res) => {
//     const { username, password } = req.body;

//     // Check if fields are empty
//     if (!username || !password) {
//       res.send({ status: 450, message: "Required All Fields" });
//     }

//     // Check if username already exists
//     const matchdata = await User.findOne({ username });
//     if (matchdata) {
//       res.send({ status: 451, message: "Username Already In Use" });
//     }

//     // Save new user
//     const postdata = new User({ username, password });
//     await postdata.save();

//     res.send({ status: 250, message: "Register Successfully" });
  
// });

//JSON WEB TOKEN
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

// Authorization
function verifyAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.send({ status: 450, message: "Token Missing" });
  }

  try {
    const user = jwt.verify(token, SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    return res.send({ status: 451, message: "Invalid or Expired Token" });
  }
}

//Loginpage
myapp.post("/Loginpage", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.send({ status: 450, message: "Required All Fields" });
  }
    const match = await User.findOne({ username, password });
    if (!match) {
      return res.send({ status: 451, message: "Wrong Username Or Password" });
    }
   
    else {
       const token = jwt.sign(
      {id:match._id, username:match.username},SECRET_KEY,{expiresIn:"3d"}
    )
      return res.send({ status: 250, message: "Login Successfully", token });
    }
});




myapp.post("/Addemployee", verifyAuth, async (req, res) => {
  const { employeeId, employeePass, fullname, phone, email, gender, dob, jobtype, department, salary, joiningDate, status, address, city, district, state, pincode, country } = req.body;
  if (fullname === "" || phone === "") {
    return res.send({ status: 450, message: "Required Fields" });
  }

  const samefield = await Employees.findOne({ fullname, phone });
  if (samefield) {
    return res.send({ status: 451, message: "This Employee Already Added" });
  }

  const postdata = new Employees({employeeId, employeePass, fullname, phone, email, gender, dob, jobtype, department, salary, joiningDate, status, address, city, district, state, pincode, country, createdBy: req.user.id });

  await postdata.save();

  res.send({ status: 250, message: "Added Successfully" });
});



myapp.delete("/Employeesdelete/:id",verifyAuth,async (req,res)=>{
  const {id} = req.params;
  const EmployeeDelete= await Employees.findByIdAndDelete(id)
  if(!EmployeeDelete){
    res.send({status:450,message:"Not Find Employee"})
  }
  else{
    res.send({status:250,message:"Delete Employee Sure"})
  }
})

myapp.put("/Employeesupdate/:id",verifyAuth, async (req, res) => {
  const { id } = req.params;
  const emp = await Employees.findByIdAndUpdate(id, req.body, { new: true });
  if (!emp) {
    return res.send({ status: 450, message: "Employee Not Found For Update" });
  }
  res.send({ status: 250, message: "Employee Updated Successfully", emp});
});

myapp.get("/Employees/:id",verifyAuth, async (req, res) => {
  const { id } = req.params;

  const emp = await Employees.findById(id);

  if (!emp) {
    return res.send({ status: 450, message: "Employee Not Found Backend" });
  }

  res.send({ status: 250, message: "Employee Found", emp });
});


// For Employees Dashboard

      // Employee Login
      const Attendance = require("../schemas/empattendance");

  myapp.post("/EmployeeLogin", async (req,res)=>{
    const {employeeId,employeePass} = req.body;
    if(!employeeId || !employeePass){
      return res.send({status:450,message:"Required All Fields..."})
    }
    const match = await Employees.findOne({employeeId,employeePass})
    if(!match){
      return res.send({status:451,message:"Wrong Credentials..."})
    }
    else{
      const token = jwt.sign(
        {id:match._id,employeeId:match.employeeId},SECRET_KEY,{expiresIn:"10d"})
      return res.send({status:251,message:"Employee Login Success",token})
    }
  })

myapp.post("/employeeCheckIn", verifyAuth, async (req, res) => {
  const employeeId = req.user.id;
  const today = new Date().toLocaleDateString("en-CA");

  const already = await Attendance.findOne({ employeeId, date: today });
  if (already) {
    return res.send({ status: 451, message: "Already Checked In" });
  }

  const AttendanceSave = new Attendance({
    employeeId,
    date: today,
    checkIn: new Date().toLocaleTimeString(),
    status: "Present"
  });

  await AttendanceSave.save();

  res.send({ status: 250, message: "Check In Successfully" });
});


myapp.post("/employeeCheckOut", verifyAuth, async (req, res) => {
  const employeeId = req.user.id;
  const today = new Date().toLocaleDateString("en-CA");

  const attendance = await Attendance.findOne({ employeeId, date: today });
  if (!attendance) {
    return res.send({ status: 451, message: "Please Check In First" });
  }

  if (attendance.checkOut) {
    return res.send({ status: 452, message: "Already Checked Out" });
  }

  attendance.checkOut = new Date().toLocaleTimeString();
  await attendance.save();

  res.send({ status: 250, message: "Check Out Successfully" });
});


myapp.get("/employeeAllAttendance", verifyAuth, async (req, res) => {
  const employeeId = req.user.id;

  const attendance = await Attendance.find({ employeeId })
    .sort({ date: -1 });

  if (!attendance || attendance.length === 0) {
    return res.send({ status: 450, message: "No Attendance Found" });
  }

  res.send({ status: 250, attendance });
});

myapp.get("/employeeProfile", verifyAuth, async (req, res) => {
  try {
    const employeeId = req.user.id;   // token se employee ki mongo _id

    const employee = await Employees.findById(employeeId)
      .select("-employeePass"); // password hide

    if (!employee) {
      return res.send({ status: 450, message: "Employee Not Found" });
    }

    res.send({ status: 250, employee });

  } catch (err) {
    res.send({ status: 500, message: "Server Error" });
  }
});

// 🔍 FIND EMPLOYEE BY ID
myapp.get("/FindById/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  const emp = await Employees.findOne({ employeeId });

  if (!emp) {
    return res.send({ status: 450, message: "Employee Not Found" });
  }

  res.send({
    status: 250,
    message: "Find Employee Success",
    EmployeeDetails: emp
  });
});


// 🔐 UPDATE PASSWORD
myapp.put("/updatePassword/:employeeId/:newPass", async (req, res) => {
  const { employeeId, newPass } = req.params;

  const emp = await Employees.findOne({ employeeId });

  if (!emp) {
    return res.send({ status: 450, message: "Employee Not Found" });
  }

  emp.employeePass = newPass;
  await emp.save();

  res.send({ status: 250, message: "Password Updated Successfully" });
});


module.exports=myapp;