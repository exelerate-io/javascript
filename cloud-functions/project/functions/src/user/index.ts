import { functions } from "../config";
import { CUSTOMERS } from "../constants";

export const removeUserCart = functions.firestore
  .document(`${CUSTOMERS}/{customerId}`)
  .onDelete(async (change) => {
    return null;
  });
