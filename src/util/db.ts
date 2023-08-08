import { ChatInputCommandInteraction, User } from "discord.js";
import { mitcoin } from "./constants";
import { getGoogleSheet, overrideGoogleSheet } from "./googleSheets";
import { MitcoinUser } from "./types";

/**
 * Load database
 */
type MitcoinPriceHistory = {
  price: number;
  tick: number;
  date: Date;
  demand: number;
};
export class DatabaseConnector {
  users: MitcoinUser[];
  numberOfUserRows: number;
  mitcoinPrice: number;
  mitcoinTick: number;
  mitcoinDemand: number;
  mitcoinPriceHistory: MitcoinPriceHistory[]; // circular buffer
  mitcoinPriceLastReadIndex: number;
  mitcoinPriceIsCurrentlyUpdating: boolean;
  constructor() {
    this.users = [];
    this.numberOfUserRows = 0;
    this.mitcoinPrice = 1;
    this.mitcoinTick = 0;
    this.mitcoinDemand = 0;
    this.mitcoinPriceHistory = [];
    this.mitcoinPriceLastReadIndex = 0;
    this.mitcoinPriceIsCurrentlyUpdating = false;
  }

  async loadDataFromSheets() {
    let json, rows;

    // Users
    json = await getGoogleSheet("People");
    rows = json.slice(1);
    for (let row of rows) {
      this.users.push({
        id: row[0],
        username: row[1],
        money: parseFloat(row[2]),
        mitcoin: parseFloat(row[3]),
        // gap in spreadsheet
        dateJoined: new Date(row[5]),
        lastCommand: row[6] ? new Date(row[6]) : null,
        lastTaxed: row[7] ? new Date(row[7]) : null,
        lastDonated: row[8] ? new Date(row[8]) : null,
      });
    }
    this.numberOfUserRows = json.length;

    // Mitcoin price (data gets added in a circular buffer)
    json = await getGoogleSheet("Mitcoin Price");
    rows = json.slice(1);
    // Find highest tick (from 2nd column)
    let highestTick = 0;
    for (let i = 0; i < rows.length; i++) {
      const tick = parseInt(rows[i][1]);
      if (tick > highestTick) {
        highestTick = tick;
        this.mitcoinPriceLastReadIndex = i;
      }
    }
    this.mitcoinTick = highestTick;
    // Convert from circular buffer to array
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      this.mitcoinPriceHistory.push({
        price: parseFloat(row[0]),
        tick: parseInt(row[1]),
        date: new Date(row[2]),
        demand: parseFloat(row[3]),
      });
    }
    this.mitcoinPriceHistory.sort((a, b) => a.tick - b.tick);
    // Get current price
    this.mitcoinPrice =
      this.mitcoinPriceHistory[this.mitcoinPriceLastReadIndex].price;
    // Get current demand
    this.mitcoinDemand =
      this.mitcoinPriceHistory[this.mitcoinPriceLastReadIndex].demand;
  }

  existsUser(id: string) {
    return this.users.some((user) => user.id === id);
  }

  /**
   * Returns a copy of the user object
   * @param id
   * @returns
   */
  getUser(id: string) {
    const user = this.users.find((user) => user.id === id);
    return { ...user };
  }

  /**
   * Returns a array of all users as-is (not copies)
   */
  getAllUsers() {
    return this.users;
  }

  async getUserAndCreateNewIfNeeded(discordUser: User): Promise<MitcoinUser> {
    const id = discordUser.id;
    const username = discordUser.username;
    if (!this.existsUser(id)) {
      await this.addNewUser(id, username);
    }
    return this.getUser(id) as MitcoinUser;
  }

  async updateUser(user: MitcoinUser) {
    const index = this.users.findIndex((u) => u.id === user.id);
    this.users[index] = user;
    // Update db
    const range = `A${index + 2}:I${index + 2}`;
    const data = [
      [
        user.id,
        user.username,
        user.money.toString(),
        user.mitcoin.toString(),
        "",
        user.dateJoined.toISOString(),
        user.lastCommand?.toISOString() ?? "",
        user.lastTaxed?.toISOString() ?? "",
        user.lastDonated?.toISOString() ?? "",
      ],
    ];
    await overrideGoogleSheet("People", range, data);
  }

  async addNewUser(id: string, username: string) {
    const user: MitcoinUser = {
      id,
      username,
      money: 1,
      mitcoin: 0,
      dateJoined: new Date(),
      lastCommand: null,
      lastTaxed: null,
      lastDonated: null,
    };
    this.users.push(user);
    // Add to db
    const insertRow = this.numberOfUserRows + 1;
    const range = `A${insertRow}:I${insertRow}`;
    const data = [
      [id, username, "1", "0", "", new Date().toISOString(), "", "", ""],
    ];
    await overrideGoogleSheet("People", range, data);
  }

  // Mitcion price
  getMitcoinPrice() {
    return this.mitcoinPrice;
  }

  // Mitcoin demand
  getMitcoinDemand() {
    return this.mitcoinDemand;
  }

  // Mitcoin increment demand
  increaseMitcoinDemand(amount: number) {
    if (amount < 0) throw new Error("amount must be positive");
    this.mitcoinDemand += amount;
  }

  // Mitcoin decrement demand
  decreaseMitcoinDemand(amount: number) {
    if (amount < 0) throw new Error("amount must be positive");
    this.mitcoinDemand -= amount;
  }

  // Mitcoin tick
  getMitcoinTick() {
    return this.mitcoinTick;
  }

  // Mitcoin price history
  getMitcoinPriceHistory() {
    return this.mitcoinPriceHistory;
  }

  // Add new mitcoin price
  async addMitcoinPriceRecord(price: number, demand: number) {
    // Update in memory
    this.mitcoinPrice = price;
    this.mitcoinTick++;
    this.mitcoinDemand = demand;
    this.mitcoinPriceHistory.push({
      price,
      tick: this.mitcoinTick,
      date: new Date(),
      demand,
    });
    if (this.mitcoinPriceHistory.length > mitcoin.maxHistory) {
      this.mitcoinPriceHistory.shift();
    }
    // Update db
    const insertRow = this.mitcoinPriceLastReadIndex + 2 + 1; // plus 1 because we want to insert after the last read index
    const range = `A${insertRow}:D${insertRow}`;
    const data = [
      [
        price.toString(),
        this.mitcoinTick.toString(),
        new Date().toISOString(),
        demand.toString(),
      ],
    ];
    await overrideGoogleSheet("Mitcoin Price", range, data);
    // Update last read index
    this.mitcoinPriceLastReadIndex++;
    if (this.mitcoinPriceLastReadIndex >= mitcoin.maxHistory) {
      this.mitcoinPriceLastReadIndex = -1;
    }
  }
}
export async function loadDatabase() {
  const db = new DatabaseConnector();
  await db.loadDataFromSheets();
  return db;
}
