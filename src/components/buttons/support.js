const {
  ActionRowBuilder,
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRow,
} = require("discord.js");
const ms = require("ms");
const logger = require("../../util/logger.js");
const errorEmbed = require("../embeds/error.js");
const ticketSetupSchema = require("../../core/system/database/mongodb/schema/ticket-setup.js");
const ticketSchema = require("../../core/system/database/mongodb/schema/ticket.js");

module.exports = {
  customId: "support",
  developer: false,
  cooldown: ms("3s"),

  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    try {
      const { member, channel, guild } = interaction;

      const ticketSetup = await ticketSetupSchema.findOne({
        guildID: guild.id,
        ticketChannelID: channel.id,
      });

      if (!ticketSetup) {
        const embed = new EmbedBuilder()
          .setTitle("❌ Ticket Setup")
          .setDescription("This channel is not set up for tickets.")
          .setColor("Red")
          .setTimestamp();

        return await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }

      await interaction.deferReply({ ephemeral: true });

      const ticketChannel = guild.channels.cache.get(
        ticketSetup.ticketChannelID
      );

      const username = member.user.globalName ?? member.user.username;

      const ticketEmbed = new EmbedBuilder()
        .setTitle("Ticket Created")
        .setDescription(
          `A ticket has been created by ${username}. Describe the reason for the ticket and please wait for staff to assist you.`
        )
        .setColor("Green")
        .setTimestamp();

      const ticketButtons = new ActionRowBuilder().setComponents([
        new ButtonBuilder()
          .setCustomId("close-ticket")
          .setLabel("Close Ticket")
          .setStyle(ButtonStyle.Danger),
      ]);

      const existingOpenTicket = await ticketSchema.findOne({
        guildID: guild.id,
        ticketCreator: member.id,
        ticketClosed: false,
      });

      if (existingOpenTicket) {
        const embed = new EmbedBuilder()
          .setTitle("❌ Ticket Error")
          .setDescription("You already have an open ticket.")
          .setColor("Red")
          .setTimestamp();

        return await interaction.editReply({
          embeds: [embed],
          ephemeral: true,
        });
      }

      const thread = await channel.threads.create({
        name: `ticket - ${username}`,
        type: ChannelType.PrivateThread,
        reason: "Ticket thread created.",
      });

      const staffRole = guild.roles.cache.get(ticketSetup.ticketStaffRoleID);

      await thread.send({
        content: `${staffRole} - ticket created by ${member}`,
        embeds: [ticketEmbed],
        components: [ticketButtons],
      });

      const newTicket = await ticketSchema.create({
        guildID: guild.id,
        channelID: thread.id,
        ticketCreator: member.id,
        ticketClosed: false,
        parentID: channel.id,
        membersAdded: [],
      });

      const success = new EmbedBuilder()
        .setTitle("Ticket Created")
        .setDescription(`Your ticket has been created in ${thread}.`)
        .setColor("Green")
        .setTimestamp();

      await interaction.editReply({
        embeds: [success],
        ephemeral: true,
      });

      await newTicket.save();
    } catch (error) {
      logger.error(error);
      const errEmbed = errorEmbed(client, interaction, error);
      await interaction.editReply({
        embeds: [errEmbed],
        ephemeral: true,
      });
    }
  },
};
