import { ColorResolvable } from "discord.js";

export interface MitcoinUser {
  peopleSheetRowNumber: number;
  id: string;
  username: string;
  mitcoin: number;
  money: number;
  dateJoined: Date;
  favoriteColor: ColorResolvable | null;
}
