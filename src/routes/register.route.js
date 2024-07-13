const express = require("express");
const generateOTP = require("../controller/register.controller");
const router = express.Router();

router.post("/generate-otp", generateOTP.generateOTP);

module.exports = router;
