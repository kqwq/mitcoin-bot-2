import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
} from "discord.js";

export default {
  data: new ContextMenuCommandBuilder()
    .setName("Donate Mitcoin")
    .setType(ApplicationCommandType.Message),
  helpDescription: "Donate mitcoin to the user who sent the message",
  async execute(interaction: MessageContextMenuCommandInteraction) {
    // Get user from targetMessage
    const targetMessage = interaction.targetMessage;
    const targetUser = targetMessage.author;

    await interaction.reply({
      content: `You are donating Mitcoin to ${targetUser.username}#${targetUser.discriminator}`,
    });
  },
};
