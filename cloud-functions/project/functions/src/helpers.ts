import {
  CollectionReference,
  DocumentData,
  DocumentReference,
} from "firebase-admin/firestore";
import { CallableContext, HttpsError } from "firebase-functions/v1/https";
import { logger } from "./config";

export const getDoc = async <T extends { id?: string }>(
  ref: DocumentReference<DocumentData>
) => {
  return ref.get().then((doc) => {
    if (!doc.exists) {
      throw new Error(`Document with id ${ref.id} does not exists.`);
    }
    return { ...doc.data(), id: doc.id } as T;
  });
};

export const getDocs = async <T>(ref: CollectionReference, ids: string[]) => {
  const promises: Promise<
    FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
  >[] = [];

  for (const id of ids) {
    promises.push(ref.doc(id).get());
  }

  return Promise.all(promises).then((docs) => {
    return docs
      .filter((doc) => doc.exists)
      .map((doc) => ({ id: doc.id, ...doc.data() } as unknown as T));
  });
};

export const assert = (data: any, key: string) => {
  if (!data || data?.[key] === undefined || data?.[key] === null) {
    throw new HttpsError("invalid-argument", `Field [${key}] not found`);
  } else {
    return data[key];
  }
};

export const catchErrors =
  (handler: (data: any, context: CallableContext) => Promise<any>) =>
  async (data: any, context: CallableContext) => {
    try {
      return await handler(data, context);
    } catch (error) {
      logger.error(error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("unknown", "", error);
    }
  };

export const checkAuthenticated = (context: CallableContext) => {
  if (!context.auth) {
    throw new HttpsError(
      "permission-denied",
      "function called without context.auth"
    );
  }
};
