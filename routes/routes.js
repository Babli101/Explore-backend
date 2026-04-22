const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Lead = require("../models/Lead");
require("dotenv").config();

// ✅ Mail setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

// 🔥 Common function (DRY code)
const handleForm = async (req, res, type) => {
  try {
    const data = { ...req.body, formType: type };

    // save to DB
    const newLead = new Lead(data);
    await newLead.save();

    // send email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: `New Lead - ${type}`,
      html: `
        <h3>New ${type} Submission</h3>
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
    res.status(500).json({ success: false, error: err.message });
  }
};


// =========================
// ✅ API ROUTES
// =========================

// 1️⃣ Contact Form
router.post("/contact", (req, res) => {
  handleForm(req, res, "contact");
});

// 2️⃣ Enquiry Form
router.post("/enquiry", (req, res) => {
  handleForm(req, res, "enquiry");
});

// 3️⃣ Newsletter Form
router.post("/newsletter", (req, res) => {
  handleForm(req, res, "newsletter");
});


// =========================
// ✅ GET APIs (admin panel)
// =========================

// contact data
router.get("/contact", async (req, res) => {
  const data = await Lead.find({ formType: "contact" }).sort({ createdAt: -1 });
  res.json(data);
});

// enquiry data
router.get("/enquiry", async (req, res) => {
  const data = await Lead.find({ formType: "enquiry" }).sort({ createdAt: -1 });
  res.json(data);
});

// newsletter data
router.get("/newsletter", async (req, res) => {
  const data = await Lead.find({ formType: "newsletter" }).sort({ createdAt: -1 });
  res.json(data);
});

module.exports = router;