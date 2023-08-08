import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("give")
    .setDescription("Give a user an amount of Mitcoin"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("WIP");
  },
};
