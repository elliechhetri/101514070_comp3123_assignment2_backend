const express = require("express");
const Employee = require("../models/Employee");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("src", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// CREATE employee (with image)
router.post("/", auth, upload.single("profileImage"), async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.profileImage = req.file.filename;
    }

    const employee = await Employee.create(data);
    res.status(201).json(employee);
  } catch (err) {
    console.error("Create employee error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// READ all employees (with search)
router.get("/", auth, async (req, res) => {
  try {
    const { department, position } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (position) filter.position = position;

    const employees = await Employee.find(filter);
    res.json(employees);
  } catch (err) {
    console.error("Get employees error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// READ one employee
router.get("/:id", auth, async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  } catch (err) {
    console.error("Get employee error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE employee
router.put("/:id", auth, upload.single("profileImage"), async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.profileImage = req.file.filename;
    }

    const emp = await Employee.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!emp) return res.status(404).json({ message: "Employee not found" });

    res.json(emp);
  } catch (err) {
    console.error("Update employee error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE employee
router.delete("/:id", auth, async (req, res) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted" });
  } catch (err) {
    console.error("Delete employee error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
