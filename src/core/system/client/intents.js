import { GatewayIntentBits } from "discord.js";

//Loading necessary modules for client
const { Guilds, GuildMembers, MessageContent, GuildMessages } =
  GatewayIntentBits;
const discordIntents = [Guilds, GuildMembers, MessageContent, GuildMessages];

export default discordIntents;
