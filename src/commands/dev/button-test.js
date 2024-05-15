const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const test = require("../../components/buttons/test.js");
const ms = require("ms");
const logger = require("../../util/logger.js");
const errorEmbed = require("../../components/embeds/error.js");

module.exports = {
  developer: true,
  cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("button-test")
    .setDescription("Tests the button component."),
  async execute(interaction, client) {
    try {
      const actionRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(test.customId)
          .setLabel("Test")
          .setStyle(ButtonStyle.Primary)
      );

      return await interaction.reply({
        content: "Click the button to test the button component.",
        components: [actionRow],
      });
    } catch (error) {
      logger.error(error);
      const embed = errorEmbed(client, interaction, error);
      return await interaction.reply({ embeds: [embed] });
    }
  },
};
