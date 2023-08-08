import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("logo")
    .setDescription("See the Mitcoin logo"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply(
      "Mitcoin Bot 2 doesn't have its own logo :(  Please help..."
    );
  },
};
