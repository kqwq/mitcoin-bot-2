import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { sendToBlockchainChannel } from "../util/botClient";
import { COLORS, mitcoin } from "../util/constants";
import { DatabaseConnector } from "../util/db";

export default {
  data: new SlashCommandBuilder()
    .setName("sell")
    .setDescription("Sell Mitcoin in return for money")

    // Amount
    .addStringOption((option) =>
      option
        .setName("amount")
        .setDescription('Amount of Mitcoin to sell (number of "all")')
        .setRequired(true)
    ),

  async execute(
    interaction: ChatInputCommandInteraction,
    db: DatabaseConnector
  ) {
    // Validate user
    const dbUser = await db.getUserAndCreateNewIfNeeded(interaction.user);
    if (dbUser.mitcoin <= 0) {
      return await interaction.reply("you don't have any Mitcoin!");
    }

    // Validate amount
    const amountStr = interaction.options.getString("amount") ?? "0";
    let amount;
    if (amountStr === "all") {
      amount = dbUser.mitcoin;
    } else {
      amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0) {
        return await interaction.reply(
          "you must specify a valid amount to sell!"
        );
      }
    }

    // If user doesn't have enough Mitcoin
    if (dbUser.mitcoin < amount) {
      return await interaction.reply(`you don't have enough ${mitcoin.emoji}`);
    }

    // Demand decreases proportionally to the user's balance
    db.decreaseMitcoinDemand(amount / dbUser.mitcoin);

    // Calculate dollar equivalent
    const dollarEquivalent = amount * db.getMitcoinPrice();

    // Actually sell
    dbUser.mitcoin -= amount;
    dbUser.money += dollarEquivalent;

    // Update database
    await db.updateUser(dbUser);

    // Send the confirmation message
    const output = `<@${interaction.user.id}> has sold ${amount.toFixed(3)} ${
      mitcoin.emoji
    } and received ${dollarEquivalent.toFixed(3)} :dollar: `;
    await interaction.reply(output);

    // Send embed to blockchain
    const embed = new EmbedBuilder()
      .setColor(dbUser.favoriteColor || COLORS.primary)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .addFields(
        {
          name: "Sold",
          value: `${amount} ${mitcoin.emoji}`,
        },
        {
          name: "Equivalent Amount",
          value: `${dollarEquivalent} :dollar:`,
        }
      )
      .setTimestamp();
    await sendToBlockchainChannel(interaction.client, embed);
  },
};
