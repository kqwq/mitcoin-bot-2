import { Client } from "discord.js";
import { setBotStatus } from "./botStatus";
import { DatabaseConnector } from "./db";
import { mitcoin } from "./constants";

export async function updateMitcoinPrice(
  client: Client,
  db: DatabaseConnector
) {
  let demand = db.getMitcoinDemand();
  let price = db.getMitcoinPrice();

  // Calculate the random fluctuation
  // Without demand: mitcoinInfo.value *= (round(random(10) - 5 + (1 - value) / 5) + 100) / 100
  const fluctuation = Math.round(Math.random() * 10 - 4.96 + demand / 16);

  // Demand decays slightly over time
  demand *= 0.9997;

  // Change Mitcoin's value
  price *= (fluctuation + 100) / 100;
  await db.addMitcoinPriceRecord(price, demand);

  // Update bot status
  setBotStatus(client, db);
  // console.log(`Updated Mitcoin price to ${price} and demand to ${demand}`);

  // bot.guilds.cache.get("424284908991676418").members.forEach(m => {
  //   // Richest of the Rich
  //   if (m.roles.cache.has("527225117818880000") && mitcoinInfo.balances[m.user.id] !== mitcoinInfo.balances[ids[0]]) m.roles.remove("527225117818880000");
  //   else if (!m.roles.cache.has("527225117818880000") && mitcoinInfo.balances[m.user.id] === mitcoinInfo.balances[ids[0]] && ids[0]) m.roles.add("527225117818880000");

  //   // Leaderboard Member
  //   if (m.roles.cache.has("527225117818880000") || (m.roles.cache.has("530794529612365863") && !ids.includes(m.user.id))) m.roles.remove("530794529612365863");
  //   else if (!m.roles.cache.has("527225117818880000") && !m.roles.cache.has("530794529612365863") && ids.includes(m.user.id)) m.roles.add("530794529612365863");

  //   // Mitcoin Millionaire
  //   if (m.roles.cache.has("530794639301673000") && mitcoinInfo.balances[m.user.id] && mitcoinInfo.balances[m.user.id].balance < 1000000) m.roles.remove("530794639301673000");
  //   else if (!m.roles.cache.has("530794639301673000") && mitcoinInfo.balances[m.user.id] && mitcoinInfo.balances[m.user.id].balance >= 1000000) m.roles.add("530794639301673000");
  // })
}

/**
 * This also immediately updates the price, then starts the interval
 * @param client
 * @param db
 */
export function startPriceFluctuation(client: Client, db: DatabaseConnector) {
  if (db.mitcoinPriceIsCurrentlyUpdating) {
    throw new Error("Price fluctuation is already running!");
  }
  db.mitcoinPriceIsCurrentlyUpdating = true;
  updateMitcoinPrice(client, db);
  setInterval(() => {
    updateMitcoinPrice(client, db);
  }, mitcoin.fluctuationTime);
}
