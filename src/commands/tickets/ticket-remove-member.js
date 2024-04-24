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
    .setName("ticket-remove-member")
    .setDescription("Removes a member from the ticket.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads)
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to remove from the ticket.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    try {
      const icon = `${client.user.displayAvatarURL()}`;
      const { channel, guild, options } = interaction;
      const user = options.getUser("user");

      if (user === client.user) {
        const embed7 = new EmbedBuilder()
          .setTitle("❌ Invalid User")
          .setDescription("I cannot remove myself from the thread.")
          .setColor("Red")
          .setThumbnail(icon)
          .setTimestamp();
        return await interaction.reply({
          embeds: [embed7],
          ephemeral: true,
        });
      }

      if (user === interaction.user) {
        const embed8 = new EmbedBuilder()
          .setTitle("❌ Invalid User")
          .setDescription("You cannot remove yourself from the thread.")
          .setColor("Red")
          .setThumbnail(icon)
          .setTimestamp();
        return await interaction.reply({
          embeds: [embed8],
          ephemeral: true,
        });
      }

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

      if (!threadMember) {
        const embed4 = new EmbedBuilder()
          .setTitle("❌ Member Not Found")
          .setDescription("This member is not in the thread.")
          .setColor("Red")
          .setThumbnail(icon)
          .setTimestamp();

        return await interaction.editReply({
          embeds: [embed4],
          ephemeral: true,
        });
      }

      await ticketSchema.findOneAndUpdate(
        {
          guildID: guild.id,
          parentID: channel.parentId,
          channelID: channel.id,
          ticketClosed: false,
        },
        {
          $pull: { membersAdded: user.id },
        }
      );

      await ticket.save();

      await channel.members.remove(user.id);

      const embed6 = new EmbedBuilder()
        .setTitle("✔️ Member Removed")
        .setDescription(`Successfully removed ${user} from the thread.`)
        .setColor("Green")
        .setThumbnail(icon)
        .setTimestamp()
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      return await interaction.editReply({ embeds: [embed6] });
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
