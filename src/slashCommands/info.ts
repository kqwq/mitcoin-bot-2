import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import {
  COLORS,
  blockchain,
  developmentGuildId,
  githubLink,
  googleSheetsViewLink,
  mitcoin,
} from "../util/constants";
import {
  millisToFormattedString,
  ticksToFormattedString,
} from "../util/dateAndTime";
import { DatabaseConnector } from "src/util/db";

export default {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Info about the bot"),

  hideOnHelpMenu: true,
  async execute(
    interaction: ChatInputCommandInteraction,
    db: DatabaseConnector
  ) {
    // Get user for favorite color
    const dbUser = await db.getUser(interaction.user.id);

    // Create embed
    const embed = new EmbedBuilder()
      .setColor(dbUser?.favoriteColor || COLORS.primary)
      .addFields(
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
          name: "Blockchain Link",
          value: `[Server](https://discord.gg/${process.env.ORIGINAL_SERVER_INVITE}) > [#blockchain](https://discord.com/channels/${blockchain.guildId}/${blockchain.channelId})`,
        }
      );

    // Send
    await interaction.reply({ embeds: [embed] });
  },
};
