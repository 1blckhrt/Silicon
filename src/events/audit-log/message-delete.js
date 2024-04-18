const { EmbedBuilder, Events } = require("discord.js");
const {
  sendAuditLogEmbed,
} = require("../../core/functions/send-audit-log-embed.js");
const logger = require("../../util/logger.js");

module.exports = {
  name: Events.MessageDelete,
  once: false,
  async execute(message, client) {
    const guildId = message.guild.id;

    if (message.author?.bot) return;

    if (message.content === null) return;

    const embed = new EmbedBuilder()
      .setTitle("Message Deleted")
      .setColor("Green").setDescription(`
        **Author** : ** ${message.author}**
        **Channel** : ** <#${message.channel.id}>**
        **Deleted Message** : \`${message.content.replace(/`/g, "'")}\`
      `);

    await sendAuditLogEmbed(client, guildId, embed);
  },
};
