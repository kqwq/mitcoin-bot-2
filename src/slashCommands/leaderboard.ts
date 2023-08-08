import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { COLORS, mitcoin } from "../util/constants";
import { DatabaseConnector } from "../util/db";
import { MitcoinUser } from "../util/types";

// Constants
type Currency = "mitcoin" | "money" | "all";
const lbTitles: Record<Currency, string> = {
  mitcoin: "Mitcoin leaderboard",
  money: "Money leaderboard",
  all: "Overall leaderboard",
};
const displayCurrency: Record<Currency, string> = {
  mitcoin: mitcoin.emoji,
  money: ":dollar:",
  all: ":dollar:",
};
const placeNames = ["First", "Second", "Third", "Fourth", "Fifth"];

export default {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the current Mitcoin leaderboard")
    .addStringOption((option) =>
      option
        .setName("currency")
        .setDescription("Mitcoin (default), money, or all")
        .setRequired(false)
        .addChoices(
          {
            name: "Mitcoin",
            value: "mitcoin",
          },
          {
            name: "Money",
            value: "money",
          },
          {
            name: "All",
            value: "all",
          }
        )
    ),
  async execute(
    interaction: ChatInputCommandInteraction,
    db: DatabaseConnector
  ) {
    // Input vars
    const currency =
      (interaction.options.getString("currency") as Currency) ?? "mitcoin";
    const users = await db.getAllUsers();
    const price = db.getMitcoinPrice();

    // Sort users
    const sortKeys: Record<
      Currency,
      (a: MitcoinUser, b: MitcoinUser) => number
    > = {
      mitcoin: (a, b) => b.mitcoin - a.mitcoin,
      money: (a, b) => b.money - a.money,
      all: (a, b) =>
        b.mitcoin * price + b.money - (a.mitcoin * price + a.money),
    };
    const sortedUsers = users.sort(sortKeys[currency]);

    // Create embed
    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setDescription(lbTitles[currency])
      .setThumbnail(interaction.client.user?.displayAvatarURL() ?? "")
      .setTimestamp();
    for (let i = 0; i < 5; i++) {
      const user = sortedUsers[i];
      if (!user) break;
      const name = `${placeNames[i]} Place`;
      const number = {
        mitcoin: user.mitcoin,
        money: user.money,
        all: user.mitcoin * price + user.money,
      };
      const value = `${user.username} | ${number[currency]} ${displayCurrency[currency]}`;
      embed.addFields({ name, value });
    }

    // Send embed
    await interaction.reply({ embeds: [embed] });
  },
};
