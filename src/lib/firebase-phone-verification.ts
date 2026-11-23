import "server-only";

const FIREBASE_ACCOUNT_LOOKUP_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:lookup";

export async function verifyFirebasePhoneToken(idToken: string) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error("Firebase Phone Authentication is not configured.");
  }

  const url = new URL(FIREBASE_ACCOUNT_LOOKUP_URL);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
    signal: AbortSignal.timeout(10_000),
  });

  if (response.status === 400 || response.status === 401) return null;
  if (!response.ok) {
    throw new Error(`Firebase account lookup failed (${response.status}).`);
  }

  const result: unknown = await response.json();
  if (
    typeof result !== "object" ||
    result === null ||
    !("users" in result) ||
    !Array.isArray(result.users)
  ) {
    throw new Error("Firebase returned an invalid account lookup response.");
  }

  const firstUser = result.users[0];
  if (
    typeof firstUser !== "object" ||
    firstUser === null ||
    !("phoneNumber" in firstUser)
  ) {
    return null;
  }

  return typeof firstUser.phoneNumber === "string"
    ? firstUser.phoneNumber
    : null;
}
