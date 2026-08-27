const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google DNS (8.8.8.8 / 1.1.1.1) to resolve MongoDB Atlas DNS SRV records
// Resolves 'querySrv ECONNREFUSED' issues on Windows / ISP DNS resolvers
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if dns setServers fails
}

const connectDb = async () => {
  try {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      throw new Error('DB_URL is not defined in .env');
    }

    console.log('Connecting to MongoDB Atlas Cloud Cluster...');
    await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('MongoDB Atlas Cloud Cluster Connected Successfully!');
  } catch (error) {
    console.error('MongoDB Atlas Connection Error:', error.message);
    throw error;
  }
};

module.exports = connectDb;