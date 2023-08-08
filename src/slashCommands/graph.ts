import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("graph")
    .setDescription("Display a graph of recent Mitcoin values")

    // Ticks
    .addIntegerOption((option) =>
      option
        .setName("ticks")
        .setDescription("Number of ticks to display")
        .setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("WIP");
  },
};
