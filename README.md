# Mitcoin Bot 2

A Discord bot that that simulates a cyptocurrency. This is based on [Mitcoin Bot](https://github.com/PotatOS03/Mitcoin/tree/master) by PotatOS03.

Features:
- A cryptocurrency simulation with taxes, demand-driven price fluctuations, and a leaderboard
- Discord bot interface complete with both [slash commands](https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ) and text-based commands
- A blockchain channel that records all invest/sell/give transactions
- A publicly-accessible Google Sheets "Database" that stores user data and the last 1000 (customizable) price fluctuations

Code
- Written in TypeScript with Type-checking
- Customizable config [here](./src/util/constants.ts) and [here](./src/util/priceFluctuate.ts)

# Commands
`balance/bal <?user>` - Check your balance in Mitcoin\
`change <?fluctuations>` - View how much Mitcoin's value has changed over time\
`color <hex>` - Change the display color for your embeds, transactions, and line graphs\
`complain` - Send a formal complaint to the Mitcoin executives\
`give <user> <amount>` - Give a user an amount of Mitcoin\
`graph <?fluctuations>` - Display a graph of recent Mitcoin values\
`help` - Show a list of commands\
`info` - View info about the bot including uptime\
`invest/buy <amount>` - Invest in a certain amount of Mitcoin\
`invite` - Join Mitcoin's server or invite the bot\
`leaderboard/lb <?"Mitcoin"|"money"|"all">` - View the current Mitcoin leaderboard\
`logo` - See the Mitcoin logo\
`sell <amount>` - Sell Mitcoin in return for money\
`value <?amount>` - See Mitcoin's current value

# Build Instructions

## Clone the repository
1. Clone the repository to your computer
2. Create a .env file in the root directory of the repository

## Google Sheets Database Setup
3. Create a service account for Google Sheets API. For more information, see [this](https://developers.google.com/workspace/guides/create-credentials#create_a_service_account) or do some Googling.
4. Create a key for the service account and download the JSON file
5. Open the JSON file and use it to fill out the following environment variables:
```pre
GOOGLE_SHEETS_PRIVATE_KEY =
GOOGLE_SHEETS_CLIENT_EMAIL =
```
6. Create a new Google Sheet, click the Share button, and share it with the service account email (as an editor)
7. On the spreadsheet, create a sheet called `People` and add the following headers:
```pre
ID,User,Money,Micoin,blank,Date joined,Favorite color
```
8. Create a second sheet called `Mitcoin Price` and add the following headers:
```pre
Price,Tick #,Date,Demand
```
9. Update `googleSpreadsheetId` in /src/util/constants.ts with the ID of the spreadsheet

## Discord Bot Setup
10.  Create a [new Discord bot](https://discord.com/developers/applications)
11.  Copy the bot's token and add `DISCORD_TOKEN = ` to the .env file
12.  Copy the application ID and add `CLIENT_ID = ` to the .env file

## Discord Server Setup
13. Create a new Discord server and invite the bot to it using the  `oauth2Link` link in /src/util/constants.ts, replacing the `${CLIENT_ID}` with your bot's application ID
14. Create a channel called `#blockchain`, copy that channel's ID, and update constants.ts appropriately
15. While you're in `constants.ts`, update any other constants you want to change
16. Add the following lines to your .env:
```pre
ORIGINAL_SERVER_INVITE = Discord invite code to the original "Mitcoin" server
NEW_SERVER_INVITE = Discord invite code to your newly created server
```

## Run the bot
17. Before running your bot, your .env file should look something like this:
```pre
GOOGLE_SHEETS_PRIVATE_KEY = See step 5
GOOGLE_SHEETS_CLIENT_EMAIL = See step 5
DISCORD_TOKEN = Discord token of the bot
CLIENT_ID = Application ID of the bot
ORIGINAL_SERVER_INVITE = Discord invite code to the original "Mitcoin" server
NEW_SERVER_INVITE = Dsicord invite code to Kyle's Web Experiments
```
18. Run `yarn install && yarn reg && yarn start` to register slash commands (both globally and in `developmentGuildId`) and start the bot.\
For any subsequent runs, just run `yarn start`

# Contact
- @kqwq on Discord