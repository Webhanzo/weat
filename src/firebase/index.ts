import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { firebaseConfig } from "./config";

function initializeFirebase() {
  const isInitialized = getApps().length > 0;
  const app = !isInitialized ? initializeApp(firebaseConfig) : getApp();
  const database = getDatabase(app);
  return { app, database };
}

export { initializeFirebase };
