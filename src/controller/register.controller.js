const User = require("../model/user-model");
const otpGenerator = require("otp-generator");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");

const OTP_EXPIRATION_TIME = 60 * 1000;

const generateOTP = async (req, res) => {
  const email = req.body.email;
  console.log(email);
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = generateNumericOTP(6);

    console.log(otp);
    const expirationTime = Date.now() + OTP_EXPIRATION_TIME;

    const updateData = {
      otp,
      otpExpiration: expirationTime,
    };

    // await User.updateOne({ email }, updateData, { upsert: true });
    await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}`);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const generateNumericOTP = (length) => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

module.exports = { generateOTP };
