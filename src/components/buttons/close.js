const {
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");
const logger = require("../../util/logger.js");
const errorEmbed = require("../embeds/error.js");
const ms = require("ms");

module.exports = {
  customId: "close-ticket",
  developer: false,
  cooldown: ms("0s"),

  async execute(interaction, client) {
    try {
      await interaction.deferReply();

      const confirmCloseTicketEmbed = new EmbedBuilder()
        .setColor("DarkRed")
        .setTitle("Close Ticket")
        .setDescription("Are you sure you want to close this ticket?");

      const confirmCloseTicketBtns = new ActionRowBuilder().setComponents([
        new ButtonBuilder()
          .setCustomId("confirm-close-ticket")
          .setLabel("Confirm")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("cancel-close-ticket")
          .setLabel("Cancel")
          .setStyle(ButtonStyle.Primary),
      ]);

      return await interaction.editReply({
        embeds: [confirmCloseTicketEmbed],
        components: [confirmCloseTicketBtns],
      });
    } catch (error) {
      logger.error(error);
      const errEmbed = errorEmbed(client, interaction, error);
      return await interaction.editReply({
        embeds: [errEmbed],
        ephemeral: true,
      });
    }
  },
};
