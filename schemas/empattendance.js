const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeesData"
    },
    date: String,
    checkIn: String,
    checkOut: String,
    status: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmpAttendance", attendanceSchema);
