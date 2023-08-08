import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { COLORS, mitcoin } from "../util/constants";
import { DatabaseConnector } from "../util/db";

export default {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your balance in Mitcoin")

    // User
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to check the balance of")
        .setRequired(false)
    ),

  async execute(
    interaction: ChatInputCommandInteraction,
    db: DatabaseConnector
  ) {
    // Get user
    const discordUser = interaction.options.getUser("user") ?? interaction.user;
    const dbUser = await db.getUserAndCreateNewIfNeeded(discordUser);

    // Vars
    const price = db.getMitcoinPrice();

    // Embed
    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setAuthor({
        name: discordUser.username,
        iconURL: discordUser.displayAvatarURL(),
      })
      .addFields(
        {
          name: "Mitcoin",
          value: `${dbUser.mitcoin.toFixed(3)} ${mitcoin.emoji}`,
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
