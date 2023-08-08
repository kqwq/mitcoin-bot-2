import { ColorResolvable } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

export const oauth2Link = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=313408&scope=bot%20applications.commands`;
export const developmentGuildId = "946842752807751700";
export const ownerUserId = "596474684980330526";
export const botPrefix = "m/";

export const COLORS: Record<string, ColorResolvable> = {
  primary: "#3935ff",
};
