/**
 * This file contains custom check for cross-orgiin resource sharing
 */

const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const whitelist = [process.env.CHALLENGE_API, `http://localhost:${process.env.PORT}`];
const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
module.exports = { cors: cors(corsOptions) };
