const express = require("express");
const generateOTP = require("../controller/register.controller");
const router = express.Router();

router.post("/generate-otp", generateOTP.generateOTP);
router.post("/verify-otp", generateOTP.verifyOTP);
router.post("/register", generateOTP.register);
router.post("/login", generateOTP.login);

module.exports = router;
