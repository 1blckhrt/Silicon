const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const ms = require("ms");
const logger = require("../../util/logger.js");
const errorEmbed = require("../../components/embeds/error.js");
const {
  info,
} = require("../../core/system/database/arrowmentdb/schema/test-schema.js");

module.exports = {
  developer: true,
  cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("json-test")
    .setDescription("Tests the JSON database.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("test")
        .setDescription("The name of the test")
        .setRequired(true)
        .addChoices(
          { name: "Create", value: "create" },
          { name: "Delete", value: "delete" },
          { name: "Find", value: "find" },
          { name: "Save", value: "save" }
        )
    ),
  async execute(interaction, client) {
    const icon = `${client.user.displayAvatarURL()}`;
    try {
      const test = interaction.options.getString("test");
      let data;
      switch (test) {
        case "create":
          data = await info.create({ Name: "test", Age: 18 });
          break;
        case "delete":
          data = await info.delete({ Name: "test", Age: 18 });
          break;
        case "find":
          data = await info.findData({ Name: "test", Age: 18 });
          break;
        case "save":
          data = await info.findData({ Name: "test", Age: 18 });
          const result = data;

          result.Name = "test";
          result.Age = 22;

          await info.save(data, { Name: "test", Age: 18 });
          break;
        default:
          data = "Invalid test.";
          break;
      }

      const finishEmbed = new EmbedBuilder()
        .setTitle("✔️ JSON Test")
        .setDescription("Successfully tested the JSON database.")
        .setColor("Green")
        .setThumbnail(`${icon}`)
        .addFields({
          name: "Data Operation",
          value: `${test}`,
        })
        .setTimestamp()
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setThumbnail(`${icon}`);

      return await interaction.reply({ embeds: [finishEmbed] });
    } catch (error) {
      logger.error(error);
      const errEmbed = errorEmbed(client, interaction, error);
      return await interaction.reply({
        embeds: [errEmbed],
      });
    }
  },
};
