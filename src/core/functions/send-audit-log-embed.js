const {
  auditLogSchema,
} = require("../system/database/arrowmentdb/schema/audit-log.js");

async function sendAuditLogEmbed(client, guildId, embed) {
  const data = await auditLogSchema.findData({ Guild: guildId });
  if (!data) return;

  const guild = client.guilds.cache.get(guildId); // Assuming `client` is defined
  if (!guild) return;

  const channel = guild.channels.cache.get(data.Channel);
  if (!channel) return;

  channel.send({ embeds: [embed] });
}

module.exports = { sendAuditLogEmbed };
