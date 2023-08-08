import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { DatabaseConnector } from "../util/db";

export default {
  data: new SlashCommandBuilder()
    .setName("lb")
    .setDescription("View the current Mitcoin leaderboard"),
  hideOnHelpMenu: true,
  async execute(
    interaction: ChatInputCommandInteraction,
    db: DatabaseConnector,
    slashCommands: any[],
    contextCommands: any[]
  ) {
    // Call /leaderboard
    const balanceCommand = slashCommands.find(
      (command) => command.data.name === "leaderboard"
    );
    balanceCommand.execute(interaction, db, slashCommands, contextCommands);
  },
};
