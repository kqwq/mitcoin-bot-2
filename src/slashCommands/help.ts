import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import { COLORS } from "../util/constants";
import { DatabaseConnector } from "src/util/db";

export default {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show the list of commands as an embed")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Type of commands to show")
        .addChoices(
          {
            name: "Slash Commands",
            value: "slash",
          },
          {
            name: "Context Commands",
            value: "context",
          }
        )
    ),

  async execute(
    interaction: ChatInputCommandInteraction,
    db: DatabaseConnector,
    slashCommands: any[],
    contextCommands: any[]
  ) {
    const showSlashCommands =
      !interaction.options.getString("type") ||
      interaction.options.getString("type") === "slash";
    const desc = showSlashCommands
      ? "List of slash commands.\nBased on and inspired by Mitcoin Bot by @area5 and @potatos03."
      : "List of context commands.\nRight click or long press a message and select the context command under Apps.";
    const embed = new EmbedBuilder()
      .setDescription(desc)
      .setColor(COLORS.primary);

    // Get data.name and data.description of every command
    const commandsToShow = showSlashCommands ? slashCommands : contextCommands;
    for (let cmd of commandsToShow) {
      if (cmd.data.name === "help") continue;
      embed.addFields({
        name: cmd.data.name,
        value: cmd.data.description ?? cmd.helpDescription,
      });
    }

    // Send embed
    await interaction.reply({ embeds: [embed] });
  },
};
