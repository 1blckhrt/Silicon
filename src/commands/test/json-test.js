import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import ms from "ms";
import logger from "../../util/logger.js";
import errorEmbed from "../../components/embeds/error.js";
import { info } from "../../core/system/database/arrowmentdb/schema/test-schema.js";

export default {
  developer: true,
  cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("json-test")
    .setDescription("Tests the JSON database.")
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
        });

      return await interaction.reply({ embeds: [finishEmbed] });
    } catch (error) {
      logger.error(error);
      return await interaction.reply({
        embeds: [errorEmbed(client, interaction, error)],
      });
    }
  },
};
