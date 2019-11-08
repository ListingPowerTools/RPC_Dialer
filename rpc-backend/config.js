const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  ACCOUNT_SID: process.env.ACCOUNT_SID,
  AUTH_TOKEN: process.env.AUTH_TOKEN,
  TWILIO_API_KEY: process.env.TWILIO_API_KEY,
  TWILIO_API_SECRET: process.env.TWILIO_API_SECRET,
  SYNC: process.env.TWILIO_SYNC_SERVICE_SID,
  WORKSPACE: process.env.TWILIO_WORKSPACE_SID,
  WORKFLOW: process.env.TWILIO_WORKFLOW_SID,
  TWILIO_NUMBER: process.env.TWILIO_NUMBER,
  RUNTIME_DOMAIN: process.env.RUNTIME_DOMAIN,
  QUEUE_NAME: process.env.PARKING_LOT_QUEUE_NAME,
  QUEUE_SID: process.env.PARKING_LOT_QUEUE_SID,
  EVENT_CALLBACK_URL: process.env.EVENT_CALLBACK_URL,
  CLONE_WORKFLOW: process.env.CLONE_WORKFLOW_SID,
  ENDPOINT: process.env.ENDPOINT
};