// Imports
import { Client } from "discord.js";
import * as dotenv from "dotenv";
import {
  handleClientEvents,
  loadContextCommands,
  loadSlashCommands,
} from "../util/init";
import { loadDatabase } from "../util/db";
import { startPriceFluctuation } from "../util/priceFluctuate";

// Config
dotenv.config();

// Create client
const client = new Client({
  intents: [],
});

async function main() {
  // Load commands and event handlers
  const db = await loadDatabase();
  // const slashCommands = await loadSlashCommands();
  // const contextCommands = await loadContextCommands();
  // await handleClientEvents(client, db, slashCommands, contextCommands);
  // console.log(
  //   `Loaded ${slashCommands.length} slash commands and ${contextCommands.length} context commands`
  // );
  await startPriceFluctuation(client, db);
  console.log("Started price fluctuation");

  // Log in using token
  client.login(process.env.DISCORD_TOKEN);
}

main();
