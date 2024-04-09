import client from "../client/client.js";
import registerSlashCommand from "./register-commands.js";
import loadEvents from "./load-events.js";
import loadComponents from "./load-components.js";
import UserEvent from "../../functions/startup-log.js";

async function start() {
  try {
    await client.login(process.env.TOKEN);
    await registerSlashCommand(client);
    await loadEvents(client);
    await loadComponents(client);
    
    const userEvent = new UserEvent({ client });
    await userEvent.run();
  } catch (err) {
    console.error(err);
  }
}

export default start;
