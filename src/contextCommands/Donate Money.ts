import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
} from "discord.js";

export default {
  data: new ContextMenuCommandBuilder()
    .setName("Donate Money")
    .setType(ApplicationCommandType.Message),
  helpDescription: "Donate money to the user who sent the message",
  async execute(interaction: MessageContextMenuCommandInteraction) {
    // Get user from targetMessage
    const targetMessage = interaction.targetMessage;
    const targetUser = targetMessage.author;

    interaction.reply("Not yet implemented");
    // await interaction.reply({
    //   content: `You are donating money to ${targetUser.username}#${targetUser.discriminator}`,
    // });
  },
};
