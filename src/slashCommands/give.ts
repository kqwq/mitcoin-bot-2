import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  User,
} from "discord.js";
import { DatabaseConnector } from "../util/db";
import { COLORS, blockchain, mitcoin } from "../util/constants";
import { sendToBlockchainChannel } from "../util/botClient";

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
        .setDescription('The amount of Mitcoin to give (number or "all")')
        .setRequired(true)
    ),

  async execute(
    interaction: ChatInputCommandInteraction,
    db: DatabaseConnector
  ) {
    // Vars
    const dbGiver = await db.getUserAndCreateNewIfNeeded(interaction.user);
    const person = interaction.options.getUser("person");
    if (!person) {
      return await interaction.reply("you must specify a person to give to");
    } else if (person.id === interaction.user.id) {
      return await interaction.reply("you can't pay yourself!");
    }
    const amountStr = interaction.options.getString("amount") ?? "0";
    let amount;
    if (amountStr === "all") {
      amount = dbGiver.mitcoin;
    } else {
      amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0) {
        return await interaction.reply(
          "you must specify a valid amount to give"
        );
      }
    }
    const price = db.getMitcoinPrice();

    // If user doesn't have any Mitcoin
    if (dbGiver.mitcoin <= 0) {
      return await interaction.reply("you don't have any Mitcoin!");
    }

    // If user doesn't have enough Mitcoin
    if (dbGiver.mitcoin < amount) {
      return await interaction.reply("you don't have enough Mitcoin to pay!");
    }

    // Create and reference receiver user
    const dbReceiver = await db.getUserAndCreateNewIfNeeded(person);

    // Actually send Mitcoin
    dbGiver.mitcoin -= amount;
    dbReceiver.mitcoin += amount;

    // Update database
    await db.updateUser(dbGiver);
    await db.updateUser(dbReceiver);

    // Send the confirmation message
    await interaction.reply(
      `${interaction.user.tag} has given ${amount} ${mitcoin.emoji} to ${person.tag}`
    );

    // Send embed to blockchain
    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .addFields(
        {
          name: "Given",
          value: `${amount} ${mitcoin.emoji}`,
        },
        {
          name: "Equivalent Amount",
          value: `${amount * price} :dollar:`,
        },
        {
          name: "Recipient",
          value: `<@${person.id}>`,
        }
      )
      .setTimestamp();
    await sendToBlockchainChannel(interaction.client, embed);
  },
};
