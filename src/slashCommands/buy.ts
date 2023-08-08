import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { DatabaseConnector } from "../util/db";

export default {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Invest in a certain amount of Mitcoin"),
  hideOnHelpMenu: true,
  async execute(
    interaction: ChatInputCommandInteraction,
    db: DatabaseConnector,
    slashCommands: any[],
    contextCommands: any[]
  ) {
    // Call /invest
    const balanceCommand = slashCommands.find(
      (command) => command.data.name === "invest"
    );
    balanceCommand.execute(interaction, db, slashCommands, contextCommands);
  },
};
