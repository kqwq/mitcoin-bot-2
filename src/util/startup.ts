import * as path from "path";
import * as fs from "fs";
import { Client, ClientApplication, SlashCommandBuilder } from "discord.js";

/**
 * Loads slash commands
 */
export async function loadSlashCommands() {
  const slashCommands = [];
  const commandsPath = path.join(process.cwd(), "src", "slashCommands");
  // Return list of files ending with .ts in commandsPath
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => {
    return file.endsWith(".ts");
  });
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath).then((command) => command.default);
    slashCommands.push(command);
  }
  return slashCommands;
}

/**
 * Load context commands
 */
export async function loadContextCommands() {
  const contextCommands = [];
  const commandsPath = path.join(process.cwd(), "src", "contextCommands");
  // Return list of files ending with .ts in commandsPath
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath).then((command) => command.default);
    contextCommands.push(command);
  }
  return contextCommands;
}

/**
 * Handle events
 */
export async function handleClientEvents(
  client: Client,
  slashCommands: any[],
  contextCommands: any[]
) {
  const eventsPath = path.join(process.cwd(), "src", "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".ts"));
  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(filePath).then((event) => event.default);
    if (event.once) {
      client.once(event.name, (...args) =>
        event.execute(...args, slashCommands, contextCommands)
      );
    } else {
      client.on(event.name, (...args) =>
        event.execute(...args, slashCommands, contextCommands)
      );
    }
  }
}
