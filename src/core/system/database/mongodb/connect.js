import { connect } from "mongoose";

async function connectToDB() {
  try {
    if (process.env.MONGO_DB) {
      await connect(process.env.MONGO_DB);
    }
  } catch (e) {
    console.log("Failed to connect to the database!");
    console.error(e);
  }
}

export default connectToDB;
