require('dotenv').config();
const mongoose = require('mongoose');

// .env se value lena
const mydb = process.env.DATABASEPATH;

// Ye line add karo — ye console me URI print karega (sirf check ke liye)
console.log("📦 DATABASE PATH:", mydb);

mongoose.connect(mydb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));
