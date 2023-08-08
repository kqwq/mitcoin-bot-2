import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { DatabaseConnector } from "../util/db";

export default {
  data: new SlashCommandBuilder()
    .setName("bal")
    .setDescription("Invest in a certain amount of Mitcoin"),

  async execute(
    interaction: ChatInputCommandInteraction,
    db: DatabaseConnector,
    slashCommands: any[],
    contextCommands: any[]
  ) {
    // Call /balance
    const balanceCommand = slashCommands.find(
      (command) => command.data.name === "buy"
    );
    balanceCommand.execute(interaction, db, slashCommands, contextCommands);
  },
};
