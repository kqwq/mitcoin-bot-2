import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { DatabaseConnector } from "../util/db";

export default {
  data: new SlashCommandBuilder()
    .setName("bal")
    .setDescription("Check your balance in Mitcoin")

    // User
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to check the balance of")
        .setRequired(false)
    ),
  hideOnHelpMenu: true,
  async execute(
    interaction: ChatInputCommandInteraction,
    db: DatabaseConnector,
    slashCommands: any[],
    contextCommands: any[]
  ) {
    // Call /balance
    const balanceCommand = slashCommands.find(
      (command) => command.data.name === "balance"
    );
    balanceCommand.execute(interaction, db, slashCommands, contextCommands);
  },
};
