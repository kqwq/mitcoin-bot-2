import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import {
  COLORS,
  developmentGuildId,
  githubLink,
  googleSheetsViewLink,
  mitcoin,
} from "../util/constants";
import {
  millisToFormattedString,
  ticksToFormattedString,
} from "../util/dateAndTime";

export default {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Info about the bot"),

  async execute(interaction: ChatInputCommandInteraction) {
    // Create embed

    const embed = new EmbedBuilder().setColor(COLORS.primary).addFields(
      {
        name: "Creator",
        value: `@area5 and @potatos03, rewritten (with permission) by [@kqwq](https://kyle.ro)`,
      },
      { name: "GitHub", value: `[mitcoin-bot-2](${githubLink})` },
      {
        name: "Backend",
        value: `[Google Sheets source](${googleSheetsViewLink})`,
      },
      {
        name: "Uptime",
        value: millisToFormattedString(process.uptime() * 1000),
      },
      {
        name: "Support & View Blockchain",
        value: `[Kyle's Web Experiments](https://discord.gg/${process.env.NEW_SERVER_INVITE})`,
      }
    );

    // Send
    await interaction.reply({ embeds: [embed] });
  },
};
