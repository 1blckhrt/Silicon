import { Events } from "discord.js";
import logger from "../../util/logger.js";

export default {
  name: Events.InteractionCreate,

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
