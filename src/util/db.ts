import { getGoogleSheet, overrideGoogleSheet } from "./googleSheets";
import { MitcoinUser } from "./types";

/**
 * Load database
 */
export class DatabaseConnector {
  users: MitcoinUser[];
  lastNonEmptyRow: number;
  constructor() {
    this.users = [];
    this.lastNonEmptyRow = 0;
  }

  async loadDataFromSheets() {
    const json = await getGoogleSheet("People");
    const rows = json.slice(1);
    for (let row of rows) {
      this.users.push({
        id: row[0],
        username: row[1],
        money: parseInt(row[2]),
        mitcoin: parseInt(row[3]),
        // gap in spreadsheet
        dateJoined: new Date(row[5]),
        lastCommand: row[6] ? new Date(row[6]) : null,
        lastTaxed: row[7] ? new Date(row[7]) : null,
        lastDonated: row[8] ? new Date(row[8]) : null,
      });
    }
    this.lastNonEmptyRow = json.length;
  }

  async existsUser(id: string) {
    return this.users.some((user) => user.id === id);
  }

  /**
   * Returns a copy of the user object
   * @param id
   * @returns
   */
  async getUser(id: string) {
    const user = this.users.find((user) => user.id === id);
    return user ? { ...user } : null;
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
    await overrideGoogleSheet("Person", range, data);
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
    const insertRow = this.lastNonEmptyRow + 1;
    const range = `A${insertRow}:I${insertRow}`;
    const data = [
      [id, username, "1", "0", "", new Date().toISOString(), "", "", ""],
    ];
    await overrideGoogleSheet("Person", range, data);
  }
}
export async function loadDatabase() {
  const db = new DatabaseConnector();
  await db.loadDataFromSheets();
  return db;
}
