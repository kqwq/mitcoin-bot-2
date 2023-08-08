import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("invest")
    .setDescription("Invest in a certain amount of Mitcoin"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("WIP");
  },
};
