import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { DatabaseConnector } from "../util/db";
import fs from "fs";
import path from "path";
import { ownerUserId } from "../util/constants";

export default {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription(
      "Reload a command (doesn't work because TypeScript problems)"
    )
    // Command
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("Command to reload")
        .setRequired(true)
    ),
  hideOnHelpMenu: true,
  async execute(
    interaction: ChatInputCommandInteraction,
    db: DatabaseConnector,
    slashCommands: any[]
  ) {
    if (interaction.user.id !== ownerUserId) {
      return await interaction.reply("You are not the bot owner!");
    }
    const commandsPath = path.join(
      __dirname,
      "../slashCommands",
      `${interaction.options.getString("command")}.ts`
    );
    try {
      const command = await import(commandsPath).then(
        (command) => command.default
      );
      const index = slashCommands.findIndex(
        (cmd) => cmd.data.name === command.data.name
      );
      slashCommands[index] = command;
    } catch (error) {
      console.log(error);
      return await interaction.reply(
        `Could not reload ${interaction.options.getString("command")}!`
      );
    }
    await interaction.reply(
      `Reloaded ${interaction.options.getString("command")}!`
    );
  },
};
