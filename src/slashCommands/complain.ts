import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  SlashCommandBuilder,
  SlashCommandStringOption,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("complain")
    .setDescription("Send a formal complaint to the Mitcoin executives"),
  hideOnHelpMenu: true,
  async execute(interaction: ChatInputCommandInteraction) {
    // Open modal
    const modal = new ModalBuilder()
      .setCustomId("complain-modal")
      .setTitle(`Complaint`);

    const complaintInput = new TextInputBuilder()
      .setCustomId("complaint-input")
      .setLabel("Your feedback")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const firstActionRow = new ActionRowBuilder().addComponents(complaintInput);

    modal.addComponents(firstActionRow as any);
    await interaction.showModal(modal);
  },
};
