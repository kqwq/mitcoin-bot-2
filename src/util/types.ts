export interface MitcoinUser {
  id: string;
  username: string;
  mitcoin: number;
  money: number;
  dateJoined: Date;
  lastCommand: Date | null;
  lastTaxed: Date | null;
  lastDonated: Date | null;
}
