import logger from "../../../util/logger.js";
import loadFiles from "../../functions/file-loader.js";

async function loadComponents(client) {
  await client.components.clear();

  const files = await loadFiles("src/components");

  //Promising all the files and looping through them and pushing them to commandsArray.
  await Promise.all(
    files.map(async (file) => {
      const component = await import(`file://${file}`);
      try {
        client.components.set(component.default.customId, component);
      } catch (err) {
        logger.error(err);
      }
    })
  );
}

export default loadComponents;
