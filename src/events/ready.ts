import { ActivityType, Client, Events } from "discord.js";

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);

    setTimeout(() => {
      client.user &&
        client.user.setActivity(`Investors`, {
          type: ActivityType.Watching,
        });
    }, 1000 * 5);
  },
};
