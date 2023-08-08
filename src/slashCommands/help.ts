import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { COLORS } from "../util/constants";

export default {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show the list of commands as an embed"),

  async execute(
    interaction: ChatInputCommandInteraction,
    slashCommands: any[]
  ) {
    const embed = new EmbedBuilder()
      .setDescription(
        "List of commands.\nBased on and inspired by Mitcoin Bot by @area5 and @potatos03."
      )
      .setColor(COLORS.primary);

    // Get data.name and data.description of every slash command
    for (let cmd of slashCommands) {
      if (cmd.data.name === "help") continue;
      embed.addFields({ name: cmd.data.name, value: cmd.data.description });
    }

    // Send embed
    await interaction.reply({ embeds: [embed] });
  },
};
