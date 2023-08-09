import { ColorResolvable } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

export const oauth2Link = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=314432&scope=bot%20applications.commands`;
export const githubLink = "https://github.com/kqwq/mitcoin-bot-2";

export const developmentGuildId = "946842752807751700";
export const ownerUserId = "596474684980330526";
export const botPrefix = "m/";
export const blockchain = {
  guildId: "424284908991676418",
  channelId: "481797287064895489",
};
export const mitcoin = {
  maxHistory: 1000, // 1000
  fluctuationTime: 5 * 60 * 1000, // 5 minutes
  emoji: "<:mitcoinshiny:1138611290265370696>",
};

export const COLORS: Record<string, ColorResolvable> = {
  primary: "#FF9900",
  graph: "#FF9900",
};

export const googleSpreadsheetId =
  "1VQCkG6LHVBHkj35p0BJQVEKYhB6s5QyCd4CTiD_7QoI";
export const googleSheetsViewLink = `https://docs.google.com/spreadsheets/d/${googleSpreadsheetId}/edit?usp=sharing`;
