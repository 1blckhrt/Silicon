const { EmbedBuilder, Events } = require("discord.js");
const {
  sendAuditLogEmbed,
} = require("../../core/functions/send-audit-log-embed.js");

module.exports = {
  name: Events.GuildMemberUpdate,
  once: false,
  async execute(oldMember, newMember, client) {
    const guildId = newMember.guild.id;

    // Check for added roles
    const addedRoles = newMember.roles.cache.filter(
      (role) => !oldMember.roles.cache.has(role.id)
    );
    // Check for removed roles
    const removedRoles = oldMember.roles.cache.filter(
      (role) => !newMember.roles.cache.has(role.id)
    );

    if (addedRoles.size > 0) {
      const addEmbed = new EmbedBuilder()
        .setTitle("Role Added")
        .setColor("Green").setDescription(`
          **Member**: ${newMember}
          **Role**: ${addedRoles.map((role) => `<@&${role.id}>`).join(", ")}
        `);

      await sendAuditLogEmbed(client, guildId, addEmbed);
    }

    if (removedRoles.size > 0) {
      const removeEmbed = new EmbedBuilder()
        .setTitle("Role Removed")
        .setColor("Green").setDescription(`
          **Member**: ${newMember}
          **Role**: ${removedRoles.map((role) => `<@&${role.id}>`).join(", ")}
        `);

      await sendAuditLogEmbed(client, guildId, removeEmbed);
    }
  },
};
