const { EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 * @param {String} emoji
 * @param {String} description
 * @param {Boolean} ephemeral
 */
async function reply(interaction, emoji, description, ephemeral) {
  //Replying
  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setDescription(`${emoji} | ${description}`)
        .setColor("RANDOM") // Note: Changed "Random" to "RANDOM"
        .setTimestamp(),
    ],
    ephemeral: ephemeral,
  });
}

module.exports = reply;
