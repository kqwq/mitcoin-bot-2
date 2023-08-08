import { Client, Events } from "discord.js";
import { setBotStatus } from "../util/botClient";
import { DatabaseConnector } from "../util/db";

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: Client, db: DatabaseConnector) {
    console.log(`🌐 Ready! Logged in as ${client.user?.tag}`);
    setBotStatus(client, db);
  },
};
