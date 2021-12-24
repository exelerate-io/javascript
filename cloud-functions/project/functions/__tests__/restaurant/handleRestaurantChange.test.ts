import { testFunctions } from "../config";
import {
  WrappedFunction,
  WrappedScheduledFunction,
} from "firebase-functions-test/lib/main";
import { handleRestaurantChange } from "../../src";
import { getFoodMenu, getRestaurant, getSettings } from "../mocks";
import { db, getElkClient } from "../../src/config";
import {
  CUSTOMERS,
  FOOD_ITEMS,
  FOOD_MENUS,
  PRIVATE_DATA,
  RESTAURANTS,
  SETTINGS,
} from "../../src/constants";

let wrapped: WrappedScheduledFunction | WrappedFunction;

beforeAll(async () => {
  wrapped = testFunctions.wrap(handleRestaurantChange);
  await db.collection(RESTAURANTS).doc("test-restaurant").set(getRestaurant());
  const settings = getSettings();
  for (const key of Object.keys(settings)) {
    await db.collection(SETTINGS).doc(key).set(settings[key]);
  }
});

afterAll(async () => {
  // await db.collection(RESTAURANTS).doc("test-restaurant").delete();
});

describe("handleRestaurantChange", () => {
  it("should fail index restaurant to elasticsearch because there is no food menu", async () => {
    const beforeSnap = testFunctions.firestore.makeDocumentSnapshot(
      {},
      "restaurants/test-restaurant"
    );
    // Make snapshot for state of database after the change
    const afterSnap = testFunctions.firestore.makeDocumentSnapshot(
      getRestaurant(),
      "restaurants/test-restaurant"
    );
    const change = testFunctions.makeChange(beforeSnap, afterSnap);

    await expect(wrapped(change)).rejects.toThrow(Error);
  }, 5000);

  describe("index to elasticsearch", () => {
    beforeEach(async () => {
      const foodMenu = getFoodMenu();
      await db
        .collection(RESTAURANTS)
        .doc("test-restaurant")
        .collection(FOOD_MENUS)
        .doc("test-foodmenu")
        .set(foodMenu.foodMenu);

      for (const item of foodMenu.foodItems) {
        await db
          .collection(RESTAURANTS)
          .doc("test-restaurant")
          .collection(FOOD_MENUS)
          .doc("test-foodmenu")
          .collection(FOOD_ITEMS)
          .doc(item.id)
          .set(item);
      }
    });

    it("should index restaurant to elasticsearch", async () => {
      const beforeSnap = testFunctions.firestore.makeDocumentSnapshot(
        {},
        "restaurants/test-restaurant"
      );
      // Make snapshot for state of database after the change
      const afterSnap = testFunctions.firestore.makeDocumentSnapshot(
        getRestaurant(),
        "restaurants/test-restaurant"
      );
      const change = testFunctions.makeChange(beforeSnap, afterSnap);
      await wrapped(change);

      const client = getElkClient();

      const response = await client.get({
        index: "restaurants_dev",
        id: "test-restaurant",
      });
      console.log(response.statusCode);
      expect(response.statusCode).toBe(200);

      const pricing = await db
        .collection(RESTAURANTS)
        .doc("test-restaurant")
        .collection(PRIVATE_DATA)
        .doc("pricing")
        .get();

      expect(pricing.exists).toBe(true);
    });

    afterEach(async () => {
      const foodMenu = getFoodMenu();
      await db
        .collection(RESTAURANTS)
        .doc("test-restaurant")
        .collection(FOOD_MENUS)
        .doc("test-foodmenu")
        .delete();

      for (const item of foodMenu.foodItems) {
        await db
          .collection(RESTAURANTS)
          .doc("test-restaurant")
          .collection(FOOD_MENUS)
          .doc("test-foodmenu")
          .collection(FOOD_ITEMS)
          .doc(item.id)
          .delete();
      }

      await getElkClient().delete({
        index: "restaurants_dev",
        id: "test-restaurant",
      });
    });
  });

  describe("remove from users favorites", () => {
    beforeEach(async () => {
      await db
        .collection(CUSTOMERS)
        .doc("test-customer")
        .set({ favorites: ["test-restaurant"] });

      await db
        .collection(RESTAURANTS)
        .doc("test-restaurant")
        .set(getRestaurant());
    });

    it("should remove restaurant id from the users favorites", async () => {
      await db.collection(RESTAURANTS).doc("test-restaurant").delete();

      const customer = await db
        .collection(CUSTOMERS)
        .doc("test-customer")
        .get();

      expect(customer.data().favorites).toEqual([]);
    });

    afterEach(async () => {});
  });
});
