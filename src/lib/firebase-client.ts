"use client";

import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export function getFirebaseClientAuth() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!apiKey || !authDomain || !appId || !projectId) {
    throw new Error(
      "Phone verification is not configured. Set the public Firebase web app variables.",
    );
  }

  const app =
    getApps().find((existingApp) => existingApp.name === "orchid-client") ??
    initializeApp(
      { apiKey, authDomain, appId, projectId },
      "orchid-client",
    );
  return getAuth(app);
}
