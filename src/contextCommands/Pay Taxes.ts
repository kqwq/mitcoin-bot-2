import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  MessageContextMenuCommandInteraction,
} from "discord.js";

export default {
  data: new ContextMenuCommandBuilder()
    .setName("Pay Taxes")
    .setType(ApplicationCommandType.Message),
  helpDescription: "Make this user pay their fair share of taxes",
  async execute(interaction: MessageContextMenuCommandInteraction) {
    // Get user from targetMessage
    const targetMessage = interaction.targetMessage;
    const targetUser = targetMessage.author;

    const modal = new ModalBuilder()
      .setCustomId("publish-modal")
      .setTitle(`Make ${targetUser.displayName} pay taxes?`);

    const reasonInput = new TextInputBuilder()
      .setCustomId("input-reason")
      .setLabel("Reason for taxation")
      .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(reasonInput);

    modal.addComponents(firstActionRow as any);
    await interaction.showModal(modal);
  },
};
