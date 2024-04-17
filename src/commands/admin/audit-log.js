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

        embed
          .setDescription("Data was successfully sent to the database.")
          .setColor("Green")
          .setTimestamp();
      } else {
        // If data already exists, update it
        await auditLogSchema.save(
          { Guild: guildId },
          { Channel: logChannel.id }
        );

        embed
          .setDescription(
            "Old data was successfully replaced with the new data."
          )
          .setColor("DarkButNotBlack")
          .setTimestamp();
      }

      // Send reply with embed
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      logger.error(error);
      const embed = errorEmbed(interaction, error);
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
