import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { COLORS, mitcoin } from "../util/constants";
import { DatabaseConnector } from "../util/db";

export default {
  data: new SlashCommandBuilder()
    .setName("color")
    .setDescription("Set your theme color")
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription(
          "Either a #XXXXXX hex color code. Enter 'none' to reset to the default orange theme."
        )
        .setRequired(true)
    ),

  async execute(
    interaction: ChatInputCommandInteraction,
    db: DatabaseConnector
  ) {
    const dbUser = await db.getUserAndCreateNewIfNeeded(interaction.user);
    const color = interaction.options.getString("color") ?? false;

    // Check if valid Discord color
    if (!color) {
      await interaction.reply({
        content: "please enter a valid hex color code",
      });
      return;
    }
    if (!color.match(/^#([0-9a-f]{3}){1,2}$/i) && color !== "none") {
      await interaction.reply({
        content: "please enter a valid hex color code",
      });
      return;
    }
    dbUser.favoriteColor = color === "none" ? null : (color as any);
    await db.updateUser(dbUser);

    // Embed
    const description =
      color === "none"
        ? "your theme color has been reset"
        : `your theme color is now ${color}`;
    const embed = new EmbedBuilder()
      .setColor(dbUser.favoriteColor || COLORS.primary)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(description);
    await interaction.reply({ embeds: [embed] });
  },
};
