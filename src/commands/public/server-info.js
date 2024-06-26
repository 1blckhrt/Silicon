const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ms = require("ms");
const logger = require("../../util/logger.js");
const errorEmbed = require("../../components/embeds/error.js");

module.exports = {
  developer: false,
  cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("server-info")
    .setDescription("Shows information about the server.")
    .setDMPermission(false),
  async execute(interaction, client) {
    try {
      const icon = client.user.displayAvatarURL();
      const guild = interaction.guild;

      const embed = new EmbedBuilder()
        .setTitle(" Server Information")
        .setDescription(`Information about ${guild.name}.`)
        .setColor("Green")
        .setThumbnail(guild.iconURL())
        .addFields(
          {
            name: "Owner",
            value: `<@${guild.ownerId}>`,
            inline: true,
          },
          {
            name: "Members",
            value: `${guild.memberCount}`,
            inline: true,
          },
          {
            name: "Roles",
            value: `${guild.roles.cache.size}`,
            inline: true,
          },
          {
            name: "Role Names",
            value: `${guild.roles.cache
              .filter((role) => role.name !== "@everyone")
              .map((role) => `<@&${role.id}>`)
              .join(", ")}`,
          },
          {
            name: "Channels",
            value: `${guild.channels.cache.size}`,
            inline: true,
          },
          {
            name: "Created At",
            value: `${guild.createdAt.toDateString()}`,
            inline: true,
          }
        )
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
