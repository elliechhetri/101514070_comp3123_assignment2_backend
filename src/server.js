const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// connect MongoDB
connectDB();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// static for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

// simple test route
app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
