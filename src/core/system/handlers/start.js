import connectToDB from "../../system/database/mongodb/connect.js";
import client from "../client/client.js";
import loadEvents from "./load-events.js";
import registerSlashCommand from "./register-commands.js";
import loadComponents from "./load-components.js";
import logger from "../../../util/logger.js";

//Functions to start the code
async function start() {
  //Logins into the client and registers slash commands
  await client
    .login(process.env.TOKEN)
    .then(async () => {
      await registerSlashCommand(client);
      await loadEvents(client);
      await loadComponents(client);
      await connectToDB();
    })
    .catch((err) => console.error(err));

  logger.success("Silicon has started successfully!");
}

export default start;
