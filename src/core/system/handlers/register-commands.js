import { REST, Routes } from "discord.js";
import loadCommands from "./load-commands.js";
import config from "../../../config.json" assert { type: "json" };
import logger from "../../../util/logger.js";

async function registerSlashCommand(client) {
  //Registering the commands
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
  const commands = await loadCommands(client);

  try {
    let setup;
    if (config.commandSetup.globalCommands) {
      setup = Routes.applicationCommands(process.env.APP_ID);
    } else {
      setup = Routes.applicationGuildCommands(
        process.env.APP_ID,
        config.commandSetup.guildId
      );
    }

    //Command data goes here
    await rest.put(setup, { body: commands });
  } catch (error) {
    logger.error("Failed to refresh (/) commands");
    console.error(error);
  }
}

export default registerSlashCommand;
