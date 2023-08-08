// Imports
import { Client } from "discord.js";
import * as dotenv from "dotenv";
import {
  handleClientEvents,
  loadContextCommands,
  loadSlashCommands,
} from "../util/init";
import { loadDatabase } from "src/util/db";

// Config
dotenv.config();

// Create client
const client = new Client({
  intents: [],
});

async function main() {
  // Load commands and event handlers
  const db = await loadDatabase();
  const slashCommands = await loadSlashCommands();
  const contextCommands = await loadContextCommands();
  await handleClientEvents(client, db, slashCommands, contextCommands);
  console.log(
    `Loaded ${slashCommands.length} slash commands and ${contextCommands.length} context commands`
  );

  // Log in using token
  client.login(process.env.DISCORD_TOKEN);
}

main();
