import { Client, Events } from "discord.js";
import { setBotStatus } from "src/util/botStatus";
import { DatabaseConnector } from "src/util/db";

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: Client, db: DatabaseConnector) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
    setBotStatus(client, db);
  },
};
