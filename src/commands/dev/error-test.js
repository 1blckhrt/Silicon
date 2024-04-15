const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const ms = require("ms");
const errorEmbed = require("../../components/embeds/error.js");

module.exports = {
  developer: true,
  cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("error-test")
    .setDescription("Tests the error embed.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const error = new Error("This is a test error.");
    const embed = errorEmbed(client, interaction, error);
    await interaction.reply({ embeds: [embed] });
  },
};
