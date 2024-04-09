import client from "../client/client.js";
import registerSlashCommand from "./register-commands.js";
import loadEvents from "./load-events.js";
import loadComponents from "./load-components.js";
import UserEvent from "../../functions/startup-log.js";
import logger from "../../../util/logger.js";

async function start() {
  try {
    await client.login(process.env.TOKEN);
    await registerSlashCommand(client);
    await loadEvents(client);
    await loadComponents(client);

    const userEvent = new UserEvent({ client });
    await userEvent.run();
    logger.success(` Logged in as ${client.user.tag}!`);
  } catch (err) {
    logger.error(`FATAL ERROR: ${err.message}`);
  }
}

export default start;
