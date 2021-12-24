import { testFunctions } from "../config";
import { handleOrderChange } from "../../src/order/handleOrderChange";
import { getOrder } from "../mocks";
import { db, getElkClient } from "../../src/config";
import { DISPATCHERS_QUEUE, EMPLOYEES, ORDERS } from "../../src/constants";
import { Timestamp } from "firebase-admin/firestore";
import {
  ContextOptions,
  WrappedFunction,
  WrappedScheduledFunction,
} from "firebase-functions-test/lib/main";
import { getOrders } from "../../src";

let wrapped: WrappedScheduledFunction | WrappedFunction;

beforeAll(async () => {
  wrapped = testFunctions.wrap(handleOrderChange);
  await db.collection(ORDERS).doc("test-order").set(getOrder("before"));
  await db
    .collection(DISPATCHERS_QUEUE)
    .doc("test-disp")
    .set({ id: "test-disp", dateEnter: new Date() });
  await db.collection(EMPLOYEES).doc("test-disp").set({ email: "test" });
});

afterAll(async () => {
  // await db.collection(ORDERS).doc("test-order").delete();
  await db.collection(EMPLOYEES).doc("test-disp").delete();
});

describe("handleOrderChange", () => {
  it("should change deliveryTime if pickupTime is changed", async () => {
    // Make snapshot for state of database beforehand
    const beforeSnap = testFunctions.firestore.makeDocumentSnapshot(
      getOrder("before"),
      "orders/test-order"
    );
    // Make snapshot for state of database after the change
    const afterSnap = testFunctions.firestore.makeDocumentSnapshot(
      getOrder("after"),
      "orders/test-order"
    );
    const change = testFunctions.makeChange(beforeSnap, afterSnap);
    // Call wrapped function with the Change object
    await wrapped(change);

    const expected =
      new Timestamp(1639077271, 614000000).toMillis() + 20 * 60000;

    const doc = await db.collection(ORDERS).doc("test-order").get();
    expect(doc.data().deliveryTime.minimumDeliveryTime.toMillis()).toEqual(
      expected
    );
    expect(doc.data().deliveryTime.maximumDeliveryTime.toMillis()).toEqual(
      expected + 20 * 60000
    );
  });

  it("should add the order into elasticsearch", async () => {
    const beforeSnap = testFunctions.firestore.makeDocumentSnapshot(
      getOrder("before"),
      "orders/test-order"
    );
    // Make snapshot for state of database after the change
    const order = getOrder("delivered");
    const afterSnap = testFunctions.firestore.makeDocumentSnapshot(
      order,
      "orders/test-order"
    );
    const change = testFunctions.makeChange(beforeSnap, afterSnap);
    // Call wrapped function with the Change object
    await wrapped(change);

    const client = getElkClient();

    const response = await client.get({ index: "orders", id: "test-order" });
    console.log(response.statusCode);
    expect(response.statusCode).toBe(200);
  });

  it("should return orders from elasticsearch", async () => {
    const wrapped = testFunctions.wrap(getOrders);
    const data = { page: 1 };

    const options: ContextOptions = {
      auth: {
        uid: "user",
      },
    };

    const response = await wrapped(data, options);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it("should assign the order to a dispatcher", async () => {
    const beforeSnap = testFunctions.firestore.makeDocumentSnapshot(
      getOrder("placed"),
      "orders/test-order"
    );
    // Make snapshot for state of database after the change
    const afterSnap = testFunctions.firestore.makeDocumentSnapshot(
      getOrder("placed"),
      "orders/test-order"
    );
    const change = testFunctions.makeChange(beforeSnap, afterSnap);
    // Call wrapped function with the Change object
    await wrapped(change);

    const doc = await db.collection(EMPLOYEES).doc("test-disp").get();
    expect(doc.data().order).not.toEqual({});
  });

  it("should add invoice stats to the order", async () => {
    const beforeSnap = testFunctions.firestore.makeDocumentSnapshot(
      getOrder("placed"),
      "orders/test-order"
    );
    // Make snapshot for state of database after the change
    const afterSnap = testFunctions.firestore.makeDocumentSnapshot(
      getOrder("delivered"),
      "orders/test-order"
    );
    const change = testFunctions.makeChange(beforeSnap, afterSnap);
    // Call wrapped function with the Change object
    await wrapped(change);

    const doc = await db.collection(ORDERS).doc("test-order").get();
    expect(doc.data().invoiceStats).not.toBe(undefined);
  });
});
