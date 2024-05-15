const { connect } = require("mongoose");
const logger = require("../../../../util/logger");

async function connectToDB() {
  try {
    if (process.env.MONGO_DB) {
      await connect(process.env.MONGO_DB);
    }
  } catch (e) {
    logger.error("Failed to connect to the database");
    console.error(e);
  }
}

module.exports = { connectToDB };
