const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const authToutes = require("./routes/auth.route");

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

app.use("/api/auth", authToutes);
