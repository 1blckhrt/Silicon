const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ms = require("ms");
const logger = require("../../util/logger.js");
const errorEmbed = require("../../components/embeds/error.js");

module.exports = {
  developer: false,
  cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("member-count")
    .setDescription("Displays the member count of the server.")
    .setDMPermission(false),
  async execute(interaction, client) {
    try {
      const icon = client.user.displayAvatarURL();
      const guild = interaction.guild;

      const embed = new EmbedBuilder()
        .setTitle(":1234: Server Member Count")
        .setDescription(`The server has ${guild.memberCount} members.`)
        .setColor("Green")
        .setThumbnail(guild.iconURL())
        .setTimestamp()
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setThumbnail(`${icon}`);
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      logger.error(error);
      const errEmbed = errorEmbed(client, interaction, error);
      return await interaction.reply({ embeds: [errEmbed] });
    }
  },
};
