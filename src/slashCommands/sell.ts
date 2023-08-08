import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("sell")
    .setDescription("Sell Mitcoin in return for money")

    // Amount
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of Mitcoin to sell")
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("WIP");
  },
};
