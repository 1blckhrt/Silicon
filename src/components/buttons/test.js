const ms = require("ms");

module.exports = {
  customId: "test",
  developer: true,
  cooldown: ms("10s"),

  async execute(interaction, client) {
    interaction.reply({ content: "it works :)" });
  },
};
