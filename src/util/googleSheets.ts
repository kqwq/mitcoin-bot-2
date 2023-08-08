import { google } from "googleapis";
import { mitcoinSpreadsheet } from "./constants";

export type ValueRenderType =
  | "FORMATTED_VALUE"
  | "UNFORMATTED_VALUE"
  | "FORMULA";
export type ValueInputType = "RAW" | "USER_ENTERED";

function loginWithServiceAccount() {
  const target = ["https://www.googleapis.com/auth/spreadsheets"];
  const jwt = new google.auth.JWT(
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    undefined,
    (process.env.GOOGLE_SHEETS_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    target
  );
  return jwt;
}

export async function getGoogleSheet(
  sheetName: string,
  valueRenderOption: ValueRenderType = "FORMATTED_VALUE"
) {
  try {
    const jwt = loginWithServiceAccount();
    const sheets = google.sheets({ version: "v4", auth: jwt });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: mitcoinSpreadsheet.spreadsheetId,
      range: sheetName, // sheet name
      valueRenderOption,
    });
    const rows = response.data.values || [];
    return rows;
  } catch (err) {
    console.log(err);
  }
  return [];
}

export async function overrideGoogleSheet(
  sheetName: string,
  range: string,
  newValues: string[][],
  valueInputOption: ValueInputType = "USER_ENTERED"
) {
  try {
    const jwt = loginWithServiceAccount();
    const sheets = google.sheets({ version: "v4", auth: jwt });
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: mitcoinSpreadsheet.spreadsheetId,
      range: "'" + sheetName + "'!" + range, // sheet name
      valueInputOption,
      requestBody: {
        values: newValues,
      },
    });
    return response;
  } catch (err) {
    console.log(err);
  }
  return [];
}
