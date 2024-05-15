const { EmbedBuilder } = require("discord.js");

function errorEmbed(client, interaction, error) {
  const icon = `${client.user.displayAvatarURL()}`;

  // Recursive function to extract nested error messages
  function extractErrorMessage(err) {
    if (err instanceof Error && err.message) {
      return `${err.message}\n${err.stack}`;
    }
    return `${err}`;
  }

  const errorMessage = extractErrorMessage(error);

  const embed = new EmbedBuilder()
    .setTitle("❗ Error")
    .setDescription("An error occurred.")
    .setColor("Red")
    .addFields({
      name: "Error Message",
      value: `\`\`\`js\n${errorMessage}\n\`\`\``,
    })
    .setThumbnail(`${icon}`)
    .setTimestamp()
    .setFooter({
      text: `Requested by ${interaction.user.username}`,
      iconURL: interaction.user.displayAvatarURL(),
    });

  return embed;
}

module.exports = errorEmbed;
