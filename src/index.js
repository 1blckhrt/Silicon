const { config } = require("dotenv");
const start = require("./core/system/handlers/start.js");
config();
start();
