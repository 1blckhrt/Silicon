const { Client, Collection } = require("discord.js");
const discordIntents = require("./intents.js");
const discordPartials = require("./partials.js");

//Constructing the client
const client = new Client({
  intents: discordIntents,
  partials: discordPartials,
  allowedMentions: {
    parse: ["everyone", "users", "roles"],
  },
  presence: {
    activities: [
      {
        name: "Silicon",
        type: 4,
        state: "/ping | Silicon",
      },
    ],
  },
});

//creating collections
client.commands = new Collection();
client.components = new Collection();
client.prefix_commands = new Collection();
client.cooldown = new Collection();

module.exports = client;
