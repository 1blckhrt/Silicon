import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import ms from "ms";
import errorEmbed from "../../components/embeds/error.js";

export default {
  developer: true,
  cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("error-test")
    .setDescription("Tests the error embed.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const error = new Error("This is a test error.");
    const embed = errorEmbed(client, interaction, error);
    await interaction.reply({ embeds: [embed] });
  },
};
