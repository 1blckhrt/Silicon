import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import ms from "ms";
import logger from "../../util/logger.js";
import errorEmbed from "../../components/embeds/error.js";
import { auditLogSchema } from "../../core/system/database/arrowmentdb/schema/audit-log.js";

export default {
  developer: false,
  cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("nickname")
    .setDescription("Change a user's nickname.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to change the nickname of.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("nickname")
        .setDescription("The new nickname.")
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute(interaction, client) {
    try {
      const user = interaction.options.getUser("user");
      const member = interaction.guild.members.cache.get(user.id);

      if (
        user.id === interaction.user.id ||
        client.user.id === user.id ||
        userMember.permissions.has(PermissionFlagsBits.KickMembers)
      ) {
        const embed = new EmbedBuilder()
          .setTitle("❌ Invalid User")
          .setDescription(
            "You don't have permission to change the nickname of this user."
          )
          .setColor("Red")
          .setThumbnail(`${icon}`)
          .setTimestamp();

        return await interaction.reply({ embeds: [embed], ephemeral: true });
      }

      const nickname = interaction.options.getString("nickname");

      const embed = new EmbedBuilder()
        .setTitle(":white_check_mark: Nickname Changed")
        .setDescription(
          `Successfully changed ${member}'s nickname to ${nickname}.`
        )
        .setColor("Green")
        .setTimestamp()
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      const result = await auditLogSchema.findData({
        guildId: interaction.guild.id,
      });

      if (result && result.auditLogChannel) {
        const auditLog = await interaction.guild.channels.cache.get(
          result.auditLogChannel
        );

        const auditEmbed = new EmbedBuilder()
          .setTitle(":abc: Nickname Changed")
          .addFields(
            { name: "User", value: `${member}`, inline: true },
            {
              name: "Moderator",
              value: interaction.user.username,
              inline: true,
            },
            { name: "New Nickname", value: nickname, inline: true }
          )
          .setColor("Green")
          .setTimestamp()
          .setFooter({
            text: `Nickname changed by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          });

        await auditLog.send({ embeds: [auditEmbed] });
      }

      await member.setNickname(nickname);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      logger.error(error);
      const embed = errorEmbed(client, interaction, error);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};