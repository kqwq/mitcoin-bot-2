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

function squeezeTo250Points(points: any[]) {
  // If there are more than 250 points, squeeze them down to 250
  if (points.length > 250) {
    const squeezedPoints = [];
    const squeezeFactor = points.length / 249.5;
    for (let i = 0; i < points.length; i += squeezeFactor) {
      squeezedPoints.push(points[Math.floor(i)]);
    }
    return squeezedPoints;
  }
  return points;
}

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
    const dbUser = await db.getUser(interaction.user.id);
    let ticks = interaction.options.getInteger("fluctuations") ?? 100;
    const currentTick = db.getMitcoinTick();

    // Points array of last "ticks" points of [date, price]
    const priceHistory = [...db.getMitcoinPriceHistory()];
    ticks = Math.min(ticks, priceHistory.length);
    priceHistory.splice(0, priceHistory.length - ticks);
    const xValues = priceHistory.map((record) => record.tick - currentTick);
    const yValues = priceHistory.map((record) => record.price);
    const price = db.getMitcoinPrice();

    // Chartjs-to-image
    const chart = new ChartJsImage();
    chart.setWidth(1000);
    chart.setHeight(600);
    chart.setBackgroundColor("rgba(0, 0, 0, 0)");
    chart.setConfig({
      type: "line",
      data: {
        labels: squeezeTo250Points(xValues),
        datasets: [
          {
            label: "Value",
            data: squeezeTo250Points(yValues),
            borderColor: dbUser?.favoriteColor || COLORS.primary,
            pointRadius: 0,
            lineTension: 0,
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
          xAxes: [
            {
              gridLines: {
                color: "rgba(174, 175, 177, 0.1)",
              },
              ticks: {
                display: false,
                maxTicksLimit: 10,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                color: "#aeafb1",
                drawTicks: false,
              },
              ticks: {
                padding: 12,
                autoSkipPadding: 32,
                fontColor: "#aeafb1",
                fontFamily: "Helvetica",
                fontSize: 24,
                suggestedMin: price,
                suggestedMax: price,
                stepSize: 0.1,
              },
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
      .setColor(dbUser?.favoriteColor || COLORS.primary)
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
