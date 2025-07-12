const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/ibook";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI); // no options needed
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

module.exports = connectToMongo;
