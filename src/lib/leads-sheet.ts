import "server-only";
import { google } from "googleapis";

type WebsiteLead = {
  source: string;
  name: string;
  phone: string;
  email: string;
  projectType: string;
  services: string[];
  location: string;
  area: string;
  budget: string;
  timeline: string;
  message: string;
  requirement: string;
  possession: string;
};

export async function appendWebsiteLead(lead: WebsiteLead) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!spreadsheetId || !clientEmail || !privateKey) {
    throw new Error(
      "Google Sheets is not configured. Set GOOGLE_SHEETS_SPREADSHEET_ID and the Firebase service-account credentials.",
    );
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Leads!A:O",
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[
        new Date().toISOString(),
        lead.source,
        lead.name,
        lead.phone,
        lead.email,
        lead.projectType,
        lead.services.join(", "),
        lead.location,
        lead.area,
        lead.budget,
        lead.timeline,
        lead.message,
        lead.requirement,
        lead.possession,
        "Verified",
      ]],
    },
  });
}
