const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const formRoutes = require("./routes/routes"); // 👈 import routes

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// root route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

// ✅ use routes
app.use("/api", formRoutes);

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});