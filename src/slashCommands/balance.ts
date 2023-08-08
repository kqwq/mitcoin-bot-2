import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { COLORS, mitcoin } from "src/util/constants";
import { DatabaseConnector } from "src/util/db";

export default {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your balance in Mitcoin"),

  async execute(
    interaction: ChatInputCommandInteraction,
    db: DatabaseConnector
  ) {
    // Get user
    const dbUser = await db.getUserAndCreateNewIfNeeded(interaction);

    // Vars
    const price = db.getMitcoinPrice();

    // Embed
    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .addFields(
        {
          name: "Mitcoin",
          value: `dbUser.mitcoin.toFixed(3) ${mitcoin.emoji}`,
          inline: true,
        },
        {
          name: "Equivalent value",
          value: `${(dbUser.mitcoin * price).toFixed(3)} :dollar:`,
          inline: true,
        },
        {
          name: "Money",
          value: `${dbUser.money.toFixed(3)} :dollar:`,
          inline: true,
        },
        {
          name: "Equivalent value",
          value: `${(dbUser.money / price).toFixed(3)} ${mitcoin.emoji}`,
          inline: true,
        }
      );

    // Reply
    await interaction.reply({ embeds: [embed] });
  },
};
