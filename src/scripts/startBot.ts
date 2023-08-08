// Imports
import { Client, GatewayIntentBits } from "discord.js";
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
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

async function main() {
  // Load commands and event handlers
  console.log("🟡 Loading Google Sheets backend...");
  const db = await loadDatabase();
  console.log("🟢 Connected to Google Sheets backend");
  const slashCommands = await loadSlashCommands();
  const contextCommands = await loadContextCommands();
  await handleClientEvents(client, db, slashCommands, contextCommands);
  console.log(
    `🌐 Loaded ${slashCommands.length} slash commands and ${contextCommands.length} context commands`
  );
  await startPriceFluctuation(client, db);
  console.log("📈 Started price fluctuation");

  // Log in using token
  client.login(process.env.DISCORD_TOKEN);
}

main();
