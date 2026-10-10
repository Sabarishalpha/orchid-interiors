import "server-only";
import { createSign } from "node:crypto";

const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const GOOGLE_SHEETS_API_URL = "https://sheets.googleapis.com/v4/spreadsheets";

export class GoogleSheetsConfigurationError extends Error {
  constructor() {
    super(
      "Google Sheets is not configured. Set GOOGLE_SHEETS_SPREADSHEET_ID and the Firebase service-account credentials.",
    );
    this.name = "GoogleSheetsConfigurationError";
  }
}

export class GoogleSheetsAccessError extends Error {
  constructor() {
    super("The service account does not have access to the Leads spreadsheet.");
    this.name = "GoogleSheetsAccessError";
  }
}

export class GoogleSheetsAuthenticationError extends Error {
  constructor() {
    super(
      "Google rejected the Sheets service-account credentials. The email and private key must come from the same active service-account key.",
    );
    this.name = "GoogleSheetsAuthenticationError";
  }
}

export class GoogleSheetsWorksheetError extends Error {
  constructor() {
    super("The spreadsheet must contain a worksheet tab named Leads.");
    this.name = "GoogleSheetsWorksheetError";
  }
}

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
  const sheetsClientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const sheetsPrivateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const hasDedicatedCredentials = Boolean(sheetsClientEmail || sheetsPrivateKey);
  if (hasDedicatedCredentials && (!sheetsClientEmail || !sheetsPrivateKey)) {
    throw new GoogleSheetsConfigurationError();
  }

  const clientEmail = hasDedicatedCredentials
    ? sheetsClientEmail
    : process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = (
    hasDedicatedCredentials
      ? sheetsPrivateKey
      : process.env.FIREBASE_PRIVATE_KEY
  )?.replace(/\\n/g, "\n");

  if (!spreadsheetId || !clientEmail || !privateKey) {
    throw new GoogleSheetsConfigurationError();
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

  const tokenResult: unknown = await tokenResponse.json();
  if (!tokenResponse.ok) {
    if (
      typeof tokenResult === "object" &&
      tokenResult !== null &&
      "error" in tokenResult &&
      tokenResult.error === "invalid_grant"
    ) {
      throw new GoogleSheetsAuthenticationError();
    }
    throw new Error(`Google OAuth token request failed (${tokenResponse.status}).`);
  }

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
    if (appendResponse.status === 403) {
      throw new GoogleSheetsAccessError();
    }
    if (appendResponse.status === 400) {
      throw new GoogleSheetsWorksheetError();
    }
    throw new Error(`Google Sheets append failed (${appendResponse.status}).`);
  }
}
