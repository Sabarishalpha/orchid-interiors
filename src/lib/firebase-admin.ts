import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function getFirebaseApp() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!projectId || !clientEmail || !privateKey || !storageBucket) return null;

  const existingApp = getApps().find((app) => app.name === "orchid-admin");
  return existingApp ?? initializeApp(
    {
      credential: cert({ projectId, clientEmail, privateKey }),
      storageBucket,
    },
    "orchid-admin",
  );
}

export function getFirebaseServices() {
  const credentials = [
    process.env.FIREBASE_PROJECT_ID,
    process.env.FIREBASE_CLIENT_EMAIL,
    process.env.FIREBASE_PRIVATE_KEY,
    process.env.FIREBASE_STORAGE_BUCKET,
  ];
  if (credentials.some(Boolean) && credentials.some((credential) => !credential)) {
    throw new Error(
      "Firebase is partially configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, and FIREBASE_STORAGE_BUCKET.",
    );
  }

  const app = getFirebaseApp();
  if (!app) return null;

  return {
    db: getFirestore(app),
    bucket: getStorage(app).bucket(),
  };
}

export function isFirebaseConfigured() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_STORAGE_BUCKET,
  );
}
