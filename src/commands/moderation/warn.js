import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";
import ms from "ms";
import logger from "../../util/logger.js";
import errorEmbed from "../../components/embeds/error.js";
import warn from "../../core/system/database/mongodb/schema/warn.js";
import { auditLogSchema } from "../../core/system/database/arrowmentdb/schema/audit-log.js";

export default {
  developer: true,
  cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warns a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to warn.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the warning.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    try {
      const icon = `${client.user.displayAvatarURL()}`;
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");
      const userMember = await interaction.guild.members.fetch(user);

      if (
        user.id === interaction.user.id ||
        client.user.id === user.id ||
        userMember.permissions.has(PermissionFlagsBits.KickMembers)
      ) {
        const embed = new EmbedBuilder()
          .setTitle("❌ Invalid User")
          .setDescription(
            "You cannot warn yourself, the bot or a user with the `Kick Members` permission."
          )
          .setColor("Red")
          .setThumbnail(`${icon}`)
          .setTimestamp();

        return await interaction.reply({ embeds: [embed], ephemeral: true });
      }

      await warn.create({
        userId: user.id,
        moderatorId: interaction.user.id,
        reason: reason,
      });

      const warningCount = await warn.countDocuments({ userId: user.id });

      const embed = new EmbedBuilder()
        .setTitle("⚠️ Warn")
        .setDescription(`You have been warned in ${interaction.guild.name}.`)
        .setColor("Red")
        .addFields(
          {
            name: "Moderator",
            value: `${interaction.user.tag}`,
            inline: true,
          },
          {
            name: "Reason",
            value: `${reason}`,
            inline: true,
          },
          {
            name: "Amount of Warnings",
            value: `${warningCount}`,
          }
        )
        .setTimestamp()
        .setFooter({
          text: `Warned by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await user.send({ embeds: [embed] });

      const finishEmbed = new EmbedBuilder()
        .setTitle("✔️ Warn Successful")
        .setDescription(`Successfully warned ${user.tag}.`)
        .setColor("Green")
        .setThumbnail(`${icon}`)
        .addFields(
          {
            name: "Reason",
            value: `${reason}`,
          },
          {
            name: "Amount of Warnings",
            value: `${warningCount}`,
          }
        )
        .setTimestamp()
        .setFooter({
          text: `Warned by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.reply({ embeds: [finishEmbed], ephemeral: true });

      const result = await auditLogSchema.findData({
        guildId: interaction.guild.id,
      });

      if (result && result.auditLogChannel) {
        const auditLog = await interaction.guild.channels.cache.get(
          result.auditLogChannel
        );
        const auditEmbed = new EmbedBuilder()
          .setTitle("⚠️ Warn")
          .setDescription(`${user.tag} has been warned.`)
          .setColor("Red")
          .addFields(
            {
              name: "Moderator",
              value: `${interaction.user.tag}`,
              inline: true,
            },
            {
              name: "User",
              value: `${user.tag}`,
              inline: true,
            },
            {
              name: "Reason",
              value: `${reason}`,
            },
            {
              name: "Amount of Warnings",
              value: `${warningCount}`,
            }
          )
          .setTimestamp()
          .setFooter({
            text: `Warned by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          });

        await auditLog.send({ embeds: [auditEmbed] });
      }
    } catch (error) {
      logger.error(error);
      const embed = errorEmbed(client, interaction, error);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
