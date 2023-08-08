import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { mitcoin } from "../util/constants";
import { DatabaseConnector } from "../util/db";

export default {
  data: new SlashCommandBuilder()
    .setName("value")
    .setDescription("See Mitcoin's current value")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Not required - an amount of Mitcoin to convert")
        .setRequired(false)
    ),

  async execute(
    interaction: ChatInputCommandInteraction,
    db: DatabaseConnector
  ) {
    const amount = interaction.options.getInteger("amount") ?? 1;
    const dollarEquivalent = amount * db.getMitcoinPrice();
    await interaction.reply(
      `${amount} ${
        mitcoin.emoji
      } is currently worth about ${dollarEquivalent.toFixed(3)} :dollar:`
    );
  },
};
