import { testFunctions } from "./config";
testFunctions.cleanup;

import { db } from "../src/config";

test("Firestore is initialized", () => {
  expect(db).toBeDefined();
});
