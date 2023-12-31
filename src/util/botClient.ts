import {
  ActivityType,
  Client,
  Embed,
  EmbedBuilder,
  Interaction,
  ModalMessageModalSubmitInteraction,
} from "discord.js";
import { DatabaseConnector } from "./db";
import { blockchain } from "./constants";

export function setBotStatus(client: Client, db: DatabaseConnector) {
  const price = db.getMitcoinPrice();
  client.user &&
    client.user.setActivity(`MTC Value: ${price.toFixed(3)}`, {
      type: ActivityType.Watching,
    });
}

export async function sendToBlockchainChannel(
  client: Client,
  embed: EmbedBuilder
) {
  const blockchainChannel = await client.channels.fetch(blockchain.channelId);
  if (blockchainChannel?.isTextBased()) {
    await blockchainChannel.send({ embeds: [embed] });
  } else {
    throw new Error("Blockchain channel is not a text channel");
  }
}

export async function modalHandler(
  interaction: ModalMessageModalSubmitInteraction
) {
  switch (interaction.customId) {
    case "complain-modal":
      const complaint = interaction.fields.getTextInputValue("complaint-input");
      await interaction.reply("Complaint submitted!");
      const embed = new EmbedBuilder()
        .setTitle("New complaint")
        .setColor("#ff0000")
        .setDescription(complaint)
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();
      await sendToBlockchainChannel(interaction.client, embed);
      break;

    default:
      break;
  }
}
