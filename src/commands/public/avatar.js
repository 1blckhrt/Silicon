import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import ms from "ms";
import logger from "../../util/logger.js";
import errorEmbed from "../../components/embeds/error.js";

export default {
  developer: false,
  cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Displays the avatar of a user.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to display the avatar.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    try {
      const user = interaction.options.getUser("user");

      const embed = new EmbedBuilder()
        .setTitle(":frame_photo: Avatar")
        .setDescription(`Here is the avatar of ${user.tag}.`)
        .setColor("Green")
        .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setTimestamp()
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        });
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      logger.error(error);
      const embed = errorEmbed(client, interaction, error);
      await interaction.reply({ embeds: [embed] });
    }
  },
};
