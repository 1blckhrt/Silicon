const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const ms = require("ms");
const logger = require("../../util/logger.js");
const errorEmbed = require("../../components/embeds/error.js");
const { warn } = require("../../core/system/database/mongodb/schema/warn.js");
const {
  auditLogSchema,
} = require("../../core/system/database/arrowmentdb/schema/audit-log.js");

module.exports = {
  developer: false,
  cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("clear-warns")
    .setDescription("Clears all warnings from a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to clear warnings from.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    try {
      const icon = client.user.displayAvatarURL();
      const user = interaction.options.getUser("user");
      const userMember = await interaction.guild.members.fetch(user);

      if (
        user.id === interaction.user.id ||
        client.user.id === user.id ||
        userMember.permissions.has(PermissionFlagsBits.KickMembers)
      ) {
        const embed = new EmbedBuilder()
          .setTitle("❌ Invalid User")
          .setDescription(
            "You cannot clear warnings from yourself, the bot or a user with the `Kick Members` permission."
          )
          .setColor("Red")
          .setThumbnail(`${icon}`)
          .setTimestamp();

        return await interaction.reply({ embeds: [embed], ephemeral: true });
      }

      await warn.deleteMany({ userId: user.id });

      const embed = new EmbedBuilder()
        .setTitle(":white_check_mark: Warnings Cleared")
        .setDescription(`Successfully cleared all warnings from ${user}.`)
        .setColor("Green")
        .setTimestamp()
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.reply({ embeds: [embed], ephemeral: true });

      const result = await auditLogSchema.findData({
        guildId: interaction.guild.id,
      });

      if (result && result.auditLogChannel) {
        const auditLog = await interaction.guild.channels.cache.get(
          result.auditLogChannel
        );

        const logEmbed = new EmbedBuilder()
          .setTitle("🚫 Warnings Cleared")
          .setDescription(
            `${interaction.user} has cleared all warnings from ${user}.`
          )
          .setColor("Green")
          .setTimestamp()
          .setFooter({
            text: `Warns cleared by ${user.id}`,
            iconURL: `${interaction.user.displayAvatarURL()}`,
          })
          .setThumbnail(`${icon}`);

        return await auditLog.send({ embeds: [logEmbed] });
      }
    } catch (error) {
      logger.error(error);
      const embed = errorEmbed(client, interaction, error);
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
