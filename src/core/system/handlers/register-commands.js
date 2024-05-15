const { REST, Routes } = require("discord.js");
const loadCommands = require("./load-commands.js");
const config = require("../../../config.json");
const logger = require("../../../util/logger.js");

async function registerSlashCommand(client) {
  // Registering the commands
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

    // Command data goes here
    await rest.put(setup, { body: commands });
  } catch (error) {
    logger.error("Failed to refresh (/) commands");
    console.error(error);
  }
}

module.exports = { registerSlashCommand };
