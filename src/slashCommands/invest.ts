import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("invest")
    .setDescription("Invest in a certain amount of Mitcoin")

    // Amount of Mitcoin to invest
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of Mitcoin to invest")
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("WIP");
  },
};
