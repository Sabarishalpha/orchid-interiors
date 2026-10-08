import "server-only";
import { createSign } from "node:crypto";

const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const GOOGLE_SHEETS_API_URL = "https://sheets.googleapis.com/v4/spreadsheets";

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

  const issuedAt = Math.floor(Date.now() / 1000);
  const unsignedAssertion = [
    Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url"),
    Buffer.from(
      JSON.stringify({
        iss: clientEmail,
        scope: GOOGLE_SHEETS_SCOPE,
        aud: GOOGLE_OAUTH_TOKEN_URL,
        iat: issuedAt,
        exp: issuedAt + 3600,
      }),
    ).toString("base64url"),
  ].join(".");
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedAssertion);
  signer.end();
  const assertion = `${unsignedAssertion}.${signer.sign(privateKey, "base64url")}`;

  const tokenResponse = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error(`Google OAuth token request failed (${tokenResponse.status}).`);
  }

  const tokenResult: unknown = await tokenResponse.json();
  if (
    typeof tokenResult !== "object" ||
    tokenResult === null ||
    !("access_token" in tokenResult) ||
    typeof tokenResult.access_token !== "string"
  ) {
    throw new Error("Google OAuth returned an invalid access token response.");
  }

  const range = encodeURIComponent("Leads!A:O");
  const appendUrl = new URL(
    `${encodeURIComponent(spreadsheetId)}/values/${range}:append`,
    `${GOOGLE_SHEETS_API_URL}/`,
  );
  appendUrl.search = new URLSearchParams({
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
  }).toString();

  const appendResponse = await fetch(appendUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenResult.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
    }),
  });

  if (!appendResponse.ok) {
    throw new Error(`Google Sheets append failed (${appendResponse.status}).`);
  }
}
