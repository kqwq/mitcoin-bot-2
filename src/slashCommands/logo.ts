import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { COLORS } from "../util/constants";

export default {
  data: new SlashCommandBuilder()
    .setName("logo")
    .setDescription("See the Mitcoin logo"),

  async execute(interaction: ChatInputCommandInteraction) {
    // Rich embed to send the logo in
    const embed = new EmbedBuilder()
      .setTitle("Don't Delay. Invest Today!")
      .setColor(COLORS.primary)
      .setImage(
        "https://cdn.discordapp.com/attachments/424284909473890318/519690965104066563/unknown_7.15.17_PM.png"
      );

    await interaction.reply({ embeds: [embed] });
  },
};
