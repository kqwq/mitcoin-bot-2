import {
  Events,
  Interaction,
  Message,
  SharedSlashCommandOptions,
  SlashCommandBuilder,
} from "discord.js";
import { botPrefix, ownerUserId } from "../util/constants";
import { DatabaseConnector } from "src/util/db";
// import { onModalSubmit } from "../util/modal.js";

export default {
  name: Events.MessageCreate,
  async execute(
    message: Message,
    db: DatabaseConnector,
    slashCommands: any[],
    contextCommands: any[]
  ) {
    // Ignore if message is from a bot
    if (message.author.bot) return;

    // If the message does not start with the prefix, ignore it
    if (!message.content.startsWith(botPrefix)) return;

    // Split the message into command and arguments
    const afterPrefix = message.content.slice(botPrefix.length);
    const args = afterPrefix.split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    // Find command
    const command = slashCommands.find((cmd) => cmd.data.name === commandName);

    // If the command doesn't exist, return
    if (!command) return;

    // Create interaction adapter for traditional commands
    const interaction = {
      user: message.author,
      client: message.client,
      guild: message.guild,
      channel: message.channel,
      message: message,
      reply: async (content: string) => {
        await message.channel.send(content);
      },
      options: {
        getString: (name: string) => {
          const ssco = command.data as SharedSlashCommandOptions;
          const index = ssco.options.findIndex(
            (option) => option.toJSON().name === name
          );
          return args[index ?? 0] || undefined;
        },
        getInteger: (name: string) => {
          const ssco = command.data as SharedSlashCommandOptions;
          const index = ssco.options.findIndex(
            (option) => option.toJSON().name === name
          );
          return parseInt(args[index ?? 0]) || undefined;
        },
        getUser: (name: string) => {
          return message.mentions.users.first();
        },
      },
      showModal: async (modal: any) => {
        message.reply(`Please use the /${commandName} slash command instead`);
      },
    };

    // Execute the command
    try {
      await command.execute(interaction, db, slashCommands, contextCommands);
    } catch (error) {
      console.error(`Error executing ${commandName}`);
      console.error(error);
    }
  },
};
