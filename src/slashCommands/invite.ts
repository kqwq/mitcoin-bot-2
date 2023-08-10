import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { COLORS, oauth2Link } from "../util/constants";
import { DatabaseConnector } from "src/util/db";

export default {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Join Mitcoin's server or invite the bot"),

  async execute(
    interaction: ChatInputCommandInteraction,
    db: DatabaseConnector
  ) {
    // Get user for favorite color
    const dbUser = await db.getUser(interaction.user.id);

    // Create embed
    const originalICode = process.env.ORIGINAL_SERVER_INVITE;
    const newICode = process.env.NEW_SERVER_INVITE;
    const embed = new EmbedBuilder()
      .setColor(dbUser?.favoriteColor || COLORS.primary)
      .addFields([
        { name: "Invite Mitcoin Bot 2", value: `[OAuth2 link](${oauth2Link})` },
        {
          name: "Original Mitcoin Server",
          value: `[${originalICode}](https://discord.gg/${originalICode})`,
        },
        {
          name: "Kyle's Web Experiments",
          value: `[${newICode}](https://discord.gg/${newICode})`,
        },
      ]);

    // Send
    await interaction.reply({ embeds: [embed] });
  },
};
