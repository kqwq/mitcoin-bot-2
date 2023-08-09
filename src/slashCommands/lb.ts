import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { DatabaseConnector } from "../util/db";

export default {
  data: new SlashCommandBuilder()
    .setName("lb")
    .setDescription("View the current Mitcoin leaderboard")
    .addStringOption((option) =>
      option
        .setName("currency")
        .setDescription("Mitcoin (default), money, or all")
        .setRequired(false)
        .addChoices(
          {
            name: "Mitcoin",
            value: "mitcoin",
          },
          {
            name: "Money",
            value: "money",
          },
          {
            name: "All",
            value: "all",
          }
        )
    ),
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
