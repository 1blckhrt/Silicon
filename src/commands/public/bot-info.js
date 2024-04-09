import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import ms from "ms";
import errorEmbed from "../../components/embeds/error.js";
import os from "os";
export default {
  developer: false,
  cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("bot-info")
    .setDescription("Displays information about the bot.")
    .setDMPermission(false),
  async execute(interaction, client) {
    try {
      const icon = `${client.user.displayAvatarURL()}`;
      const embed = new EmbedBuilder()
        .setTitle(":robot: Bot Information")
        .setDescription("Here is some information about the bot.")
        .setColor("Green")
        .addFields({
          name: "Bot Name",
          value: `${client.user.username}`,
          inline: true,
        })
        .addFields({ name: "Bot ID", value: `${client.user.id}`, inline: true })
        .addFields({
          name: "Bot Tag",
          value: `${client.user.tag}`,
          inline: true,
        })
        .addFields({
          name: "Bot Discriminator",
          value: `${client.user.discriminator}`,
          inline: true,
        })
        .addFields({
          name: "Bot Created At",
          value: client.user.createdAt.toUTCString(),
          inline: true,
        })
        .addFields({
          name: "Bot Uptime",
          value: `${formatUptime(client.uptime)}`,
          inline: true,
        })
        .addFields({
          name: "Bot Node.js Version",
          value: `${process.version}`,
          inline: true,
        })
        .addFields({
          name: "Bot Memory Usage",
          value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
            2
          )} MB`,
          inline: true,
        })
        .addFields({
          name: "Bot Guilds",
          value: `${client.guilds.cache.size}`,
          inline: true,
        })
        .addFields({
          name: "Bot Channels",
          value: `${client.channels.cache.size}`,
          inline: true,
        })
        .addFields({
          name: "Bot Users",
          value: `${client.users.cache.size}`,
          inline: true,
        })
        .addFields({
          name: "Bot Commands",
          value: `${client.commands.size}`,
          inline: true,
        })
        .addFields({
          name: "Host OS",
          value: `${process.platform}`,
          inline: true,
        })
        .addFields({ name: "Host CPU", value: `${process.arch}`, inline: true })
        .addFields({
          name: "Host Uptime",
          value: `${formatHostUptime(os.uptime())}`,
          inline: true,
        })
        .addFields({
          name: "Host Memory Usage",
          value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`, // Convert bytes to MB
          inline: true,
        })
        .setThumbnail(`${icon}`)
        .setTimestamp()
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      return await interaction.reply({ embeds: [embed] });
    } catch (error) {
      logger.error(error);
      return await interaction.reply({
        embeds: [errorEmbed(client, interaction, error)],
        ephemeral: true,
      });
    }
  },
};

function formatHostUptime(uptime) {
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

function formatUptime(uptime) {
  const totalSeconds = Math.floor(uptime / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}
