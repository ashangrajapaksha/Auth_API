const express = require("express");
const generateOTP = require("../controller/auth.controller");
const router = express.Router();

router.post("/verify-otp", generateOTP.verifyOTP);
router.post("/register", generateOTP.register);
router.post("/login", generateOTP.login);

module.exports = router;
