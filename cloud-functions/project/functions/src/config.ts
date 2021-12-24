import { initializeApp } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import * as cloudFunctions from "firebase-functions";
import { Config } from "./types/config";

console.log("GCLOUD_PROJECT", process.env.GCLOUD_PROJECT);

if (process.env.NODE_ENV === "local") {
  console.log("FIRESTORE_EMULATOR", process.env.FIRESTORE_EMULATOR_HOST);
}

const app = initializeApp();

export const db = getFirestore(app);
const settings = { timestampsInSnapshots: true };
db.settings(settings);

export const bucket = getStorage(app).bucket(
  `${process.env.GCLOUD_PROJECT}.appspot.com`
);

export const logger = cloudFunctions.logger;

export const config = cloudFunctions.config() as Config;

export const REGION = "europe-west3";

export const functions = cloudFunctions.region(REGION);
