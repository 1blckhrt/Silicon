const { EmbedBuilder, Events } = require("discord.js");
const {
  sendAuditLogEmbed,
} = require("../../core/functions/send-audit-log-embed.js");

module.exports = {
  name: Events.GuildMemberUpdate,
  once: false,
  async execute(oldMember, newMember, client) {
    const guildId = newMember.guild.id;

    if (oldMember.nickname !== newMember.nickname) {
      const embed = new EmbedBuilder()
        .setTitle("Nickname Update")
        .setColor("Green").setDescription(`
            **Member**: ${newMember}
            **Old Nickname**: ${oldMember.nickname || "None"}
            **New Nickname**: ${newMember.nickname || "None"}
            `);

      await sendAuditLogEmbed(client, guildId, embed);
    }
  },
};
