const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    department: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number },
    profileImage: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
