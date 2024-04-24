const { EmbedBuilder } = require("discord.js");
const logger = require("../../util/logger.js");
const errorEmbed = require("../../components/embeds/error.js");
const ms = require("ms");

module.exports = {
  customId: "cancel-close-ticket",
  developer: false,
  cooldown: ms("0s"),

  async execute(interaction, client) {
    try {
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Ticket Close Cancelled")
        .setDescription("Ticket close has been canceled.")
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      logger.error(error);
      const errEmbed = errorEmbed(interaction, client, error);
      return await interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
  },
};
