const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ThreadChannel,
} = require("discord.js");
const ms = require("ms");
const logger = require("../../util/logger.js");
const errorEmbed = require("../../components/embeds/error.js");
const ticketSchema = require("../../core/system/database/mongodb/schema/ticket");

module.exports = {
  developer: false,
  cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("ticket-add-member")
    .setDescription("Adds a member to the ticket.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads)
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to add to the ticket.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    try {
      const icon = `${client.user.displayAvatarURL()}`;
      const { channel, guild, options } = interaction;
      const user = options.getUser("user");

      await interaction.deferReply({});

      if (!(channel instanceof ThreadChannel)) {
        const embed = new EmbedBuilder()
          .setTitle("❌ Invalid Thread")
          .setDescription("This command can only be used in a thread.")
          .setColor("Red")
          .setThumbnail(icon)
          .setTimestamp();

        return await interaction.editReply({
          embeds: [embed],
          ephemeral: true,
        });
      }

      const ticket = await ticketSchema.findOne({
        guildID: guild.id,
        parentID: channel.parentId,
        channelID: channel.id,
      });

      if (!ticket) {
        const embed2 = new EmbedBuilder()
          .setTitle("❌ Invalid Ticket")
          .setDescription("This thread is not a ticket.")
          .setColor("Red")
          .setThumbnail(icon)
          .setTimestamp();

        return await interaction.editReply({
          embeds: [embed2],
          ephemeral: true,
        });
      }

      const memberExistsInServer = guild.members.cache.find(
        (mbr) => mbr.id === user.id
      );

      if (!memberExistsInServer) {
        const embed3 = new EmbedBuilder()
          .setTitle("❌ Invalid Member")
          .setDescription("This member does not exist in the server.")
          .setColor("Red")
          .setThumbnail(icon)
          .setTimestamp();
        return await interaction.editReply({
          embeds: [embed3],
          ephemeral: true,
        });
      }

      const threadMember = await channel.members
        .fetch(user.id)
        .catch(() => null);

      if (threadMember) {
        const embed4 = new EmbedBuilder()
          .setTitle("❌ Member Already Added")
          .setDescription("This member is already added to the thread.")
          .setColor("Red")
          .setThumbnail(icon)
          .setTimestamp();

        return await interaction.editReply({
          embeds: [embed4],
          ephemeral: true,
        });
      }

      if (!ticket.membersAdded) {
        ticket.membersAdded = [];
      }

      ticket.membersAdded.push(user.id);

      await ticket.save();

      await channel.members.add(user.id);

      const embed = new EmbedBuilder()
        .setTitle("✔️ Member Added")
        .setDescription(`Successfully added ${user} to the thread.`)
        .setColor("Green")
        .setThumbnail(icon)
        .setTimestamp()
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      return await interaction.editReply({ embeds: [embed] });
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
