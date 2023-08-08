import { Events, Interaction, Message } from "discord.js";
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
    if (!command)
      return console.error(
        `No message command matching ${botPrefix}${commandName} found`
      );

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
          const index = command.data.options?.findIndex(
            (option: any) => option.name === name
          );
          return args[index ?? 0];
        },
        getInteger: (name: string) => {
          const index = command.data.options?.findIndex(
            (option: any) => option.name === name
          );
          return parseInt(args[index ?? 0]);
        },
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
