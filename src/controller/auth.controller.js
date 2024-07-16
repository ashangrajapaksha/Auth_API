const User = require("../model/user-model");
const otpGenerator = require("otp-generator");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");

const OTP_EXPIRATION_TIME = 60 * 1000;

/**
 * Register after verifying Email
 * @returns {string}
 */
const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const otpResponse = await generateOTPLocally(email);

    if (otpResponse.error) {
      return res.status(500).json({ message: "Error generating OTP" });
    }

    res
      .status(200)
      .json({ message: "User registered successfully. OTP sent to email." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Function to generate a random OTP
 * @param {string} email - Email of the user
 * @returns {object} - Response message
 */
const generateOTP = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return { error: true, message: "Email is required" };
    }

    const otp = generateNumericOTP(6);
    const expirationTime = Date.now() + OTP_EXPIRATION_TIME;
    const updateData = {
      otp,
      otpExpiration: expirationTime,
    };
    console.log(updateData);
    await User.updateOne({ email }, updateData, { upsert: true });

    // await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}`);

    res.status(200).json({ error: false, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
};

const generateOTPLocally = async (email) => {
  try {
    if (!email) {
      return { error: true, message: "Email is required" };
    }

    const otp = generateNumericOTP(6);
    const expirationTime = Date.now() + OTP_EXPIRATION_TIME;
    const updateData = {
      otp,
      otpExpiration: expirationTime,
    };
    console.log(updateData);
    await User.updateOne({ email }, updateData, { upsert: true });

    // await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}`);

    return { error: false, message: "OTP sent successfully" };
  } catch (error) {
    return { error: true, message: "Server error" };
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

/**
 * Function to verify the OTP provided by the user
 * @returns {boolean} - Returns true if the OTP is verified successfully, otherwise false
 */
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }
    if (user.otp !== otp || user.otpExpiration < new Date()) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    await User.updateOne(
      { _id: user._id },
      { otp: null, otpExpiration: null, isEmailVerified: true }
    );

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Login method
 * @returns {string}
 */
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { verifyOTP, generateOTP, register, login };
