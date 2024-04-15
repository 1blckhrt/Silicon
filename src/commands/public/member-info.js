const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ms = require("ms");
const logger = require("../../util/logger.js");
const errorEmbed = require("../../components/embeds/error.js");

module.exports = {
  developer: false,
  cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("member-info")
    .setDescription("Displays information about a member.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription(
          "The member to get information about. Leave blank to view your own information."
        )
        .setRequired(false)
    ),
  async execute(interaction, client) {
    try {
      const member =
        interaction.options.getMember("member") || interaction.member;
      const icon = `${client.user.displayAvatarURL()}`;
      const embed = new EmbedBuilder()
        .setTitle(":bust_in_silhouette: Member Information")
        .setDescription("Here is some information about the member.")
        .setColor("Green")
        .setThumbnail(member.user.displayAvatarURL())
        .addFields({
          name: "Member Name",
          value: `${member.user.username}`,
          inline: true,
        })
        .addFields({ name: "Member ID", value: `${member.id}`, inline: true })
        .addFields({
          name: "Member Created At",
          value: member.user.createdAt.toUTCString(),
          inline: true,
        })
        .addFields({
          name: "Member Joined At",
          value: member.joinedAt.toUTCString(),
          inline: true,
        })
        .addFields({
          name: "Member Roles",
          value: `${member.roles.cache
            .filter((role) => role.name !== "@everyone")
            .map((role) => `<@&${role.id}>`)
            .join(", ")}`,
          inline: true,
        })
        .setThumbnail(`${icon}`);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      logger.error(error);
      const embed = errorEmbed(client, interaction, error);
      await interaction.reply({ embeds: [embed] });
    }
  },
};
