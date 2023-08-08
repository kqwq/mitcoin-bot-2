import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
} from "discord.js";
import { DatabaseConnector } from "src/util/db";

export default {
  data: new ContextMenuCommandBuilder()
    .setName("Donate Mitcoin")
    .setType(ApplicationCommandType.Message),
  helpDescription: "Donate mitcoin to the user who sent the message",
  async execute(
    interaction: MessageContextMenuCommandInteraction,
    db: DatabaseConnector
  ) {
    const dbUser = await db.getUserAndCreateNewIfNeeded(interaction.user);
    const targetUser = await db.getUserAndCreateNewIfNeeded(
      interaction.targetMessage.author
    );
  },
};
