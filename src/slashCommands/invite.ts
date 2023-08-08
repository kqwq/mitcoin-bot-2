import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Join Mitcoin's server or invite the bot"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("Hello test!");
  },
};
