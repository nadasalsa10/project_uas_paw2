const mongoose = require('mongoose');

let cached = global.mongooseConn;

async function connectDB() {
  if (cached) return cached;
  cached = global.mongooseConn = await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB terhubung');
  return cached;
}

module.exports = connectDB;