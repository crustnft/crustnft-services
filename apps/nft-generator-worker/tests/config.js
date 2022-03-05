/* eslint-disable */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const TEST_ENV = '.env.test';

if (fs.existsSync(path.resolve(__dirname, '..', TEST_ENV))) {
  dotenv.config({
    path: TEST_ENV,
  });
} else {
  console.log(`Missing ${TEST_ENV}, please create the file from .env.sample.`);
  process.exit(1);
}
