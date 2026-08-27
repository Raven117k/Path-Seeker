const app = require('../server');
const connectDb = require('../config/connection');

let databaseConnection;

module.exports = async function handler(req, res) {
  databaseConnection ||= connectDb();

  try {
    await databaseConnection;
  } catch (error) {
    databaseConnection = undefined;
    return res.status(503).json({ message: 'Database connection unavailable' });
  }

  return app(req, res);
};
