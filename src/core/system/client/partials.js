const { Partials } = require("discord.js");

//Loading necessary modules for client
const { GuildMember, Message, ThreadMember, Channel } = Partials;
const discordPartials = [GuildMember, Message, ThreadMember, Channel];

module.exports = discordPartials;
