import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const MONGODB_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

if (!MONGODB_URL) {
  throw new Error("MONGO_URL environment variable is not defined");
}

if (!PORT) {
  throw new Error("PORT environment variable is not defined");
}

const dbConnect = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("MongoDB Connected Successfully!");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("MongoDB Connection failed", error);
  }
};

dbConnect();

interface UserDocument extends mongoose.Document {
  firstName: String;
  lastName: String;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

const User = mongoose.model<UserDocument>("User", userSchema);

app.post("/api/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  await user.save();
  res.status(201).send("User registered");
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("Invalid credentials");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send("Invalid credentials");
  }
  const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
    expiresIn: "1h",
  });
  res.json({ token, userId: user._id });
});
