import { ColorResolvable } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

export const oauth2Link = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=313408&scope=bot%20applications.commands`;
export const developmentGuildId = "946842752807751700";
export const ownerUserId = "596474684980330526";
export const botPrefix = "m/";
export const blockchain = {
  guildId: "946842752807751700",
  channelId: "1138462464497954836",
};
export const mitcoin = {
  maxHistory: 1000,
  fluctuationTime: 5 * 60 * 1000, // 5 minutes
  emoji: "<:mitcoin2:1138463536243281970>",
};

export const COLORS: Record<string, ColorResolvable> = {
  primary: "#3935ff",
};

export const mitcoinSpreadsheet = {
  spreadsheetId: "1VQCkG6LHVBHkj35p0BJQVEKYhB6s5QyCd4CTiD_7QoI",
  sheets: [
    {
      name: "People",
    },
    {
      name: "Transactions",
    },
  ],
};
