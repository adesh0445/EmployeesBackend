const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeId:String,
    employeePass:String,
    fullname: String,
    phone: String,
    email: String,
    gender: String,
    dob: String,

    jobtype: String,
    department: String,
    salary: String,
    joiningDate: String,
    status: { type: String, default: "active" },

    address: String,
    city: String,
    district: String,   // ⭐ ADDED
    state: String,
    pincode: String,
    country: String,

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmployeesData", employeeSchema);
