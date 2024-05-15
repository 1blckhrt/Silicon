const logger = require("../../../util/logger.js");
const path = require("path");
const { loadFiles } = require("../../functions/file-loader.js");

async function loadComponents(client) {
  await client.components.clear();

  const files = await loadFiles("src/components");

  await Promise.all(
    files.map(async (file) => {
      try {
        const component = require(path.resolve(file));
        client.components.set(component.customId, component);
      } catch (err) {
        logger.error(err);
      }
    })
  );
}

module.exports = { loadComponents };
