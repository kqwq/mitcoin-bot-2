import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("give")
    .setDescription("Give a user an amount of Mitcoin")

    // Person
    .addUserOption((option) =>
      option
        .setName("person")
        .setDescription("The person to give Mitcoin to")
        .setRequired(true)
    )

    // Amount
    .addStringOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of Mitcoin to give (e.g. 0.5, 100, all)")
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("WIP");
  },
};
