const express=require('express');
const myapp=express.Router();

myapp.get("/",(req,res)=>{
res.send("<div><h1>This deault express page</h1></div>")
})

const appmenu=require("../schemas/appmenu")
myapp.get("/applist",async (req,res)=>{
    const appdata=await appmenu.find();
    res.send({status:250,applist:appdata})
})    

const User=require('../schemas/user')
myapp.get('/userlist',verifyAuth,async (req,res)=>{
    const Userdata= await User.find();
    res.send({status:250,userlist:Userdata})
});

const Employees=require("../schemas/employees")
myapp.get("/Employeeslist",verifyAuth,async (req,res)=>{
  const EmployeesData=await Employees.find();
  res.send({status:250,Employeeslist:EmployeesData})
})

myapp.post("/Registerpage", async (req, res) => {
    const { username, password } = req.body;

    // Check if fields are empty
    if (!username || !password) {
      res.send({ status: 450, message: "Required All Fields" });
    }

    // Check if username already exists
    const matchdata = await User.findOne({ username });
    if (matchdata) {
      res.send({ status: 451, message: "Username Already In Use" });
    }

    // Save new user
    const postdata = new User({ username, password });
    await postdata.save();

    res.send({ status: 250, message: "Register Successfully" });
  
});

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
      {id:match._id, username:match.username},SECRET_KEY,{expiresIn:"1d"}
    )
      return res.send({ status: 250, message: "Login Successfully", token });
    }
});

myapp.post("/Addemployee",verifyAuth, async (req,res)=>{
  const {fullname,phone,email,jobtype,salary,gender} = req.body;

  if(fullname==="" || phone===""){
    return res.send({status:450,message:"Required Fields"});
  }

  const samefield = await Employees.findOne({fullname,phone});
  if(samefield){
    return res.send({status:451,message:"This Employee Already Added"});
  }

  const postdata = new Employees({ fullname, phone, email, jobtype, salary,gender });
  await postdata.save();

  res.send({ status: 250, message: "Added Successfully" });
})

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
  res.send({ status: 250, message: "Employee Updated Successfully", emp
  });
});

myapp.get("/Employees/:id",verifyAuth, async (req, res) => {
  const { id } = req.params;

  const emp = await Employees.findById(id);

  if (!emp) {
    return res.send({ status: 450, message: "Employee Not Found" });
  }

  res.send({ status: 250, message: "Employee Found", emp });
});








module.exports=myapp;