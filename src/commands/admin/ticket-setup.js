const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const ms = require("ms");
const logger = require("../../util/logger.js");
const errorEmbed = require("../../components/embeds/error.js");
const ticketSetupSchema = require("../../core/system/database/mongodb/schema/ticket-setup.js");

module.exports = {
  developer: false,
  cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("ticket-setup")
    .setDescription("Sets up the ticket system.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addChannelOption((option) =>
      option
        .setName("ticket-channel")
        .setDescription("The channel where the tickets will be created.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send when the ticket embed is created.")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to ping when the ticket embed is created.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The title of the ticket embed.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    try {
      const icon = `${client.user.displayAvatarURL()}`;
      const { guild, options } = interaction;
      const ticketChannel = options.getChannel("ticket-channel");
      const message = options.getString("message");
      const role = options.getRole("role");
      const title = options.getString("title");

      await interaction.deferReply({ ephemeral: true });

      const embed = new EmbedBuilder()
        .setTitle(title)
        .addFields({
          name: "Message:",
          value: `${message}`,
        })
        .setColor("Green")
        .setTimestamp()
        .setThumbnail(guild.iconURL());

      const ticketSuccess = new EmbedBuilder()
        .setTitle("Ticket System Setup")
        .setDescription("Successfully setup the ticket system.")
        .addFields(
          {
            name: "Channel that the tickets will be setup in:",
            value: `${ticketChannel.name}`,
          },
          {
            name: "Message to send when the embed is created:",
            value: `${message}`,
          },
          {
            name: "Role to ping when the ticket is created:",
            value: `${role}`,
          }
        )
        .setColor("Green")
        .setTimestamp()
        .setThumbnail(icon);

      const openTicketButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("support")
          .setLabel("Open Ticket")
          .setStyle(ButtonStyle.Primary)
      );

      let ticketSetup = await ticketSetupSchema.findOne({
        ticketChannelID: ticketChannel.id,
      });

      if (ticketSetup) {
        const ticketExisting = new EmbedBuilder()
          .setTitle("Ticket System Setup")
          .setDescription("This channel already has a ticket system setup.")
          .setColor("Red")
          .setTimestamp()
          .setThumbnail(icon);

        return await interaction.editReply({
          embeds: [ticketExisting],
        });
      } else {
        ticketSetup = await ticketSetupSchema.create({
          guildID: guild.id,
          ticketChannelID: ticketChannel.id,
          ticketStaffRoleID: role.id,
        });

        await ticketSetup.save();

        await ticketChannel.send({
          embeds: [embed],
          components: [openTicketButton],
        });

        return await interaction.editReply({
          embeds: [ticketSuccess],
          ephemeral: true,
        });
      }
    } catch (error) {
      logger.error(error);
      const errEmbed = errorEmbed(client, interaction, error);
      return await interaction.editReply({
        embeds: [errEmbed],
        ephemeral: true,
      });
    }
  },
};
