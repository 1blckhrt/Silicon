const logger = require("../../../util/logger.js");
const { loadFiles } = require("../../functions/file-loader.js");
const path = require("path");

async function loadEvents(client) {
  const files = await loadFiles("src/events");

  await Promise.all(
    files.map(async (file) => {
      try {
        const event = require(path.resolve(file));
        const eventName = event.name;
        const execute = (...args) => event.execute(...args, client);

        if (event.rest) {
          if (event.once) client.rest.once(eventName, execute);
          else client.rest.on(eventName, execute);
        } else {
          if (event.once) client.once(eventName, execute);
          else client.on(eventName, execute);
        }
      } catch (err) {
        logger.error(`Failed to load event(s)`);
        console.log(err);
      }
    })
  );
}

module.exports = { loadEvents };
