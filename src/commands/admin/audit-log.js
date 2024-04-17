const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const ms = require("ms");
const {
  auditLogSchema,
} = require("../../core/system/database/arrowmentdb/schema/audit-log.js");
const logger = require("../../util/logger.js");
const errorEmbed = require("../../components/embeds/error.js");

module.exports = {
  developer: false,
  cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("audit-log-setup")
    .setDescription("Sets up the audit log.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to set the audit log to.")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const icon = `${client.user.displayAvatarURL()}`;
      const { channel, guildId, options } = interaction;

      const logChannel = options.getChannel("channel") || channel;
      const embed = new EmbedBuilder();

      const existingData = await auditLogSchema.findData({ Guild: guildId });

      if (!existingData) {
        // If no data exists, create new data
        await auditLogSchema.create({
          Guild: guildId,
          Channel: logChannel.id,
        });

        const embed = new EmbedBuilder()
          .setTitle("✔️ Audit Log Setup")
          .setDescription("Successfully setup the audit log.")
          .setColor("Green")
          .setThumbnail(`${icon}`)
          .addFields({
            name: "Channel",
            value: `${logChannel.name}`,
          })
          .setTimestamp()
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          });

        return await interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        // If data already exists, update it
        await auditLogSchema.save(
          { Guild: guildId },
          { Channel: logChannel.id }
        );

        const embed2 = new EmbedBuilder()
          .setTitle("✔️ Audit Log Setup")
          .setDescription("Successfully setup the audit log.")
          .setColor("Green")
          .setThumbnail(`${icon}`)
          .addFields({
            name: "Channel",
            value: `${logChannel.name}`,
          })
          .setTimestamp()
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          });

        return await interaction.reply({ embeds: [embed2], ephemeral: true });
      }
    } catch (error) {
      logger.error(error);
      const errEmbed = errorEmbed(interaction, error);
      return await interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
  },
};
