const {
  PermissionFlagsBits,
  EmbedBuilder,
  ThreadChannel,
} = require("discord.js");
const ms = require("ms");
const ticketSchema = require("../../core/system/database/mongodb/schema/ticket");
const logger = require("../../util/logger");
const errorEmbed = require("../embeds/error");

module.exports = {
  customId: "confirm-close-ticket",
  developer: false,
  cooldown: ms("0s"),
  async execute(interaction, client) {
    try {
      const { member, channel, guild } = interaction;

      // Define thread
      let thread = channel;
      if (!channel.isThread()) {
        thread = guild.threads.cache.find((thread) => thread.id === channel.id);
      }

      let parentID = null;

      // Check if 'thread' is a ThreadChannel
      if (thread instanceof ThreadChannel) {
        parentID = thread.parentId;
      } else {
        console.log("The provided channel is not a thread.");
      }

      const icon = `${client.user.displayAvatarURL()}`;

      const closingEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Closing Ticket")
        .setDescription("This ticket has been closed.")
        .setTimestamp();

      await interaction.reply({ embeds: [closingEmbed] });

      const updatedTicket = await ticketSchema.findOneAndUpdate(
        {
          guildID: guild.id,
          parentID: parentID,
          ticketCreator: member.id,
          ticketClosed: false,
        },
        {
          ticketClosed: true,
        },
        { new: true }
      );

      await channel.setLocked();
      await channel.setArchived(true, "Ticket Closed");
    } catch (error) {
      logger.error(error);
      const errEmbed = errorEmbed(client, interaction, error);
      return await interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
  },
};
