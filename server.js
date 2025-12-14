const express = require('express');
const myapp = express();
require('dotenv').config();
const cors = require('cors');

// ✅ CORS FIX (MOST IMPORTANT)
myapp.use(cors({
  origin: [
    "http://localhost:3000",
    "https://adeshemployessfronted.vercel.app"
  ],
  credentials: true
}));

myapp.use(express.json());
myapp.use(express.urlencoded({ extended: true }));

require('./database/mydb');

const myrouting = require('./approute/approute');
myapp.use(myrouting);

const myport = process.env.PORT || 9800;
myapp.listen(myport, () => {
  console.log(`✅ Server running on port ${myport}`);
});
