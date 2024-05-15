const { GatewayIntentBits } = require("discord.js");

//Loading necessary modules for client
const { Guilds, GuildMembers, MessageContent, GuildMessages } =
  GatewayIntentBits;
const discordIntents = [Guilds, GuildMembers, MessageContent, GuildMessages];

module.exports = discordIntents;
