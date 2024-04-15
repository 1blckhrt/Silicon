const { Events } = require("discord.js");
const logger = require("../../util/logger.js");

module.exports = {
  name: Events.INTERACTION_CREATE,

  async execute(interaction, client) {
    if (!interaction.isCommand() && !interaction.isAutocomplete()) return;

    const subcommand = interaction.options._subcommand ?? "";
    const subcommandGroup = interaction.options._subcommandGroup ?? "";
    const commandArgs = interaction.options._hoistedOptions ?? [];
    const args = `${subcommandGroup} ${subcommand} ${commandArgs
      .map((arg) => arg.value)
      .join(" ")}`.trim();
    logger.info(
      `${interaction.user.tag} (${interaction.user.id}) > /${interaction.commandName} ${args}`
    );
  },
};
