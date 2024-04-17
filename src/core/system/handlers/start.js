const client = require("../client/client.js");
const { registerSlashCommand } = require("./register-commands.js");
const { loadEvents } = require("./load-events.js");
const { loadComponents } = require("./load-components.js");
const logger = require("../../../util/logger.js");
const { connectToDB } = require("../database/mongodb/connect.js");

async function start() {
  try {
    await client.login(process.env.TOKEN);
    await registerSlashCommand(client);
    await loadEvents(client);
    await loadComponents(client);
    await connectToDB();
    console.clear();
    logger.success(` Logged in as ${client.user.tag}!`);
  } catch (err) {
    console.log(err);
  }
}

module.exports = start;
