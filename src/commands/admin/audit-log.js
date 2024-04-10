import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import ms from "ms";
import { auditLogSchema } from "../../core/system/database/arrowmentdb/schema/audit-log.js";
import logger from "../../util/logger.js";
import errorEmbed from "../../components/embeds/error.js";

export default {
  developer: false,
  cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("audit-log-setup")
    .setDescription("Sets up the audit log.")
    .setDMPermission(false)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to set the audit log.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    try {
      const icon = client.user.displayAvatarURL();
      const channel = interaction.options.getChannel("channel");

      await auditLogSchema.create({
        guildId: interaction.guild.id,
        auditLogChannel: channel.id,
      });

      const embed2 = new EmbedBuilder()
        .setTitle("✔️ Audit Log Setup")
        .setDescription(`The audit log has been set to <#${channel.id}>.`)
        .setColor("Green")
        .setTimestamp()
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setThumbnail(`${icon}`);

      await interaction.reply({ embeds: [embed2], ephemeral: true });
    } catch (error) {
      logger.error(error);
      const embed = errorEmbed(client, interaction, error);
      await interaction.reply({ embeds: [embed] });
    }
  },
};
