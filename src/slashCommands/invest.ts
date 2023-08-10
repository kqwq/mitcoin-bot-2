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
    .setName("invest")
    .setDescription("Invest in a certain amount of Mitcoin")

    // Amount of Mitcoin to invest
    .addStringOption((option) =>
      option
        .setName("amount")
        .setDescription('Amount of Mitcoin to invest (number or "all")')
        .setRequired(true)
    ),

  async execute(
    interaction: ChatInputCommandInteraction,
    db: DatabaseConnector
  ) {
    // Validate user
    const dbUser = await db.getUserAndCreateNewIfNeeded(interaction.user);
    if (dbUser.money <= 0) {
      return await interaction.reply("you can't invest in any Mitcoin!");
    }

    // Validate amount
    const amountStr = interaction.options.getString("amount") ?? "0";
    let amount;
    if (amountStr === "all") {
      amount = dbUser.money;
    } else {
      amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0) {
        return await interaction.reply(
          "you must specify a valid amount to invest!"
        );
      }
    }

    // If user doesn't have enough money
    if (dbUser.money < amount) {
      return await interaction.reply("you don't have enough :dollar:");
    }

    //  // Daily invest limit
    //  if (investments[message.author.id].invested > 1) return message.reply("you can only invest twice per day");
    //  investments[message.author.id].invested++;
    //  setTimeout(function() {
    //    investments[message.author.id].invested--;
    //    if (investments[message.author.id].invested > 0) message.reply("you may invest again!");
    //  }, 86400000);

    // Demand increases proportionally to the user's balance
    db.increaseMitcoinDemand(amount / dbUser.money);

    // Calculate Mitcoin equivalent
    let mitcoinEquivalent = amount / db.getMitcoinPrice();

    // If the transaction is at least 100 Mitcoin, give it a 5% tax
    if (mitcoinEquivalent >= 100) {
      mitcoinEquivalent *= 0.95;
    }

    // Actually invest
    dbUser.mitcoin += mitcoinEquivalent;
    dbUser.money -= amount;

    // Update database
    await db.updateUser(dbUser);

    // Send the confirmation message
    let output = `<@${
      interaction.user.id
    }> has earned ${mitcoinEquivalent.toFixed(3)} ${
      mitcoin.emoji
    } after investing ${amount.toFixed(3)} :dollar: `;
    if (mitcoinEquivalent >= 100) {
      output += "(5% tax) ";
    }
    if (dbUser.money === 0) {
      output += "and cannot invest any more :dollar:";
    } else {
      output += `and has ${dbUser.money.toFixed(3)} :dollar: left to invest`;
    }
    await interaction.reply(output.trim());

    // Send embed to blockchain
    const embed = new EmbedBuilder()
      .setColor(dbUser.favoriteColor || COLORS.primary)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .addFields(
        {
          name: "Invested",
          value: `${amount} :dollar:`,
        },
        {
          name: "Equivalent Amount",
          value: `${mitcoinEquivalent} ${mitcoin.emoji}`,
        }
      )
      .setTimestamp();
    if (mitcoinEquivalent >= 100) {
      embed.addFields({
        name: "Tax",
        value: `${mitcoinEquivalent * 0.05} ${mitcoin.emoji}`,
      });
    }
    await sendToBlockchainChannel(interaction.client, embed);
  },
};
