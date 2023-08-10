import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { COLORS, mitcoin } from "../util/constants";
import { DatabaseConnector } from "../util/db";
import { ticksToFormattedString } from "../util/dateAndTime";

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
    // Get user for favorite color
    const dbUser = await db.getUser(interaction.user.id);

    // Time
    const ticks = interaction.options.getInteger("fluctuations") ?? 100;
    const timeStr = ticksToFormattedString(ticks);

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
    const displayVal = `${Math.round(
      (price / priceRecord.price) * 100
    )}%\n${priceRecord.price.toFixed(3)} -> ${price.toFixed(3)}`;

    // Embed
    const embed = new EmbedBuilder()
      .setColor(dbUser?.favoriteColor || COLORS.primary)
      .setTitle(`Mitcoin change over the past ${timeStr}`)
      .addFields({
        name: `${ticks} fluctuation${ticks > 1 ? "s" : ""}`,
        value: displayVal,
      });

    // Reply
    await interaction.reply({ embeds: [embed] });
  },
};
