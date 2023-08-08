import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { COLORS, mitcoin } from "../util/constants";
import { DatabaseConnector } from "../util/db";

export default {
  data: new SlashCommandBuilder()
    .setName("change")
    .setDescription("View how much Mitcoin's value has changed over time")

    // Number of fluctuations (called 'ticks' in the code and Google sheet)
    .addIntegerOption((option) =>
      option
        .setName("fluctuations")
        .setDescription("Specify a number of fluctuations")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(mitcoin.maxHistory)
    ),

  async execute(
    interaction: ChatInputCommandInteraction,
    db: DatabaseConnector
  ) {
    // Time
    const ticks = interaction.options.getInteger("fluctuations") ?? 1;
    const millis = mitcoin.fluctuationTime * ticks;
    const minutes = millis / 1000 / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    // Formats
    // X minute(s)
    // X hour(s), Y minute(s)
    // X day(s), Y hour(s), Z minute(s)
    let timeStr = "";
    if (days >= 1) {
      const daysInt = Math.floor(days);
      timeStr += `${daysInt} day${daysInt > 1 ? "s" : ""}, `;
    }
    if (hours >= 1) {
      const hoursInt = Math.floor(hours % 24);
      timeStr += `${hoursInt} hour${hoursInt > 1 ? "s" : ""}, `;
    }
    if (minutes >= 1) {
      const minutesInt = Math.floor(minutes % 60);
      timeStr += `${minutesInt} minute${minutesInt > 1 ? "s" : ""}, `;
    }
    timeStr = timeStr.trim().replace(/,$/, "");

    // Past price
    const price = db.getMitcoinPrice();
    const priceHistory = db.getMitcoinPriceHistory();
    const seekTick = db.getMitcoinTick() - ticks;
    const priceRecord = priceHistory.find((record) => record.tick === seekTick);
    if (!priceRecord?.tick) {
      return await interaction.reply(
        `There was an error getting the price history. Tick ${seekTick} not found.`
      );
    }

    // Embed
    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle(`Mitcoin change over the past ${timeStr}`)
      .addFields({
        name: `${ticks} fluctuation${ticks > 1 ? "s" : ""}`,
        value: `${Math.round((price / priceRecord.price) * 100)}%`,
      });

    // Reply
    await interaction.reply({ embeds: [embed] });
  },
};
