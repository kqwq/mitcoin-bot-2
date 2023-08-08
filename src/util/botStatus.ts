import { ActivityType, Client } from "discord.js";
import { DatabaseConnector } from "./db";

export function setBotStatus(client: Client, db: DatabaseConnector) {
  const price = db.getMitcoinPrice();
  client.user &&
    client.user.setActivity(`MTC Value: ${price.toFixed(3)}`, {
      type: ActivityType.Watching,
    });
}
