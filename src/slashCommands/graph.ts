import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { COLORS } from "../util/constants";
import { DatabaseConnector } from "../util/db";
import ChartJsImage from "chartjs-to-image";
import { ticksToFormattedString } from "../util/dateAndTime";

export default {
  data: new SlashCommandBuilder()
    .setName("graph")
    .setDescription("Display a graph of recent Mitcoin values")

    // Ticks
    .addIntegerOption((option) =>
      option
        .setName("fluctuations")
        .setDescription("Number of fluctuations to display")
        .setRequired(false)
    ),
  async execute(
    interaction: ChatInputCommandInteraction,
    db: DatabaseConnector
  ) {
    let ticks = interaction.options.getInteger("fluctuations") ?? 100;
    const currentTick = db.getMitcoinTick();

    // Points array of last "ticks" points of [date, price]
    const priceHistory = [...db.getMitcoinPriceHistory()];
    ticks = Math.min(ticks, priceHistory.length);
    priceHistory.splice(0, priceHistory.length - ticks);
    const xValues = priceHistory.map((record) => record.tick - currentTick);
    const yValues = priceHistory.map((record) => record.price);

    // Chartjs-to-image
    const chart = new ChartJsImage();
    chart.setWidth(800);
    chart.setHeight(600);
    chart.setBackgroundColor("rgba(0, 0, 0, 0)");
    chart.setConfig({
      type: "line",
      data: {
        labels: xValues,
        datasets: [
          {
            label: "Mitcoin Price",
            data: yValues,
            borderColor: COLORS.graph,
            pointRadius: 0,
            borderWidth: 3,
            fill: false,
          },
        ],
      },
      options: {
        // Don't show legend
        legend: {
          display: false,
        },
        // Show X legend called "ticks"
        scales: {
          xAxis: [
            {
              display: false,
            },
          ],
        },
      },
    });

    // Convert to attachment
    const buf = await chart.toBinary();
    const attachment = new AttachmentBuilder(buf).setName("graph.png");

    // Send the embed
    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setTitle("Mitcoin Price History")
      .setDescription(
        `Mitcoin value over the past ${ticks} fluctuation${
          ticks > 1 ? "s" : ""
        } (${ticksToFormattedString(ticks)})`
      )
      .setImage("attachment://graph.png")
      .setTimestamp();
    await interaction.reply({ embeds: [embed], files: [attachment] });
  },
};
