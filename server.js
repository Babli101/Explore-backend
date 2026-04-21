// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const Lead = require("./models/Lead");

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// 🔥 Mail setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

// 🔥 API Route (ALL FORMS)
app.post("/api/form", async (req, res) => {
  try {
    const data = req.body;

    // save to DB
    const newLead = new Lead(data);
    await newLead.save();

    // send email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: `New Lead - ${data.formType}`,
      html: `
        <h3>New Form Submission</h3>
        <p><b>Type:</b> ${data.formType}</p>
        <p><b>Name:</b> ${data.name || "-"}</p>
        <p><b>Email:</b> ${data.email || "-"}</p>
        <p><b>Phone:</b> ${data.phone || "-"}</p>
        <p><b>Project:</b> ${data.project || "-"}</p>
        <p><b>Message:</b> ${data.message || "-"}</p>
      `
    });

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});