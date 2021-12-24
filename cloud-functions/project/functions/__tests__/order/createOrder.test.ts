import { testFunctions } from "../config";
import { createOrder } from "../../src/index";
import { RequestBody } from "../../src/order/createOrder";
import { HttpsError } from "firebase-functions/v1/https";
import {
  ContextOptions,
  WrappedFunction,
} from "firebase-functions-test/lib/main";
import { db } from "../../src/config";
import { CARTS } from "../../src/constants";
import { getCart } from "../mocks";

testFunctions.cleanup();

let wrapped: WrappedFunction;

let cartIdSuccess = "test-cart-123";
let cartIdFail = "test-cart-123-fail";

beforeAll(async () => {
  const cartSuccess = getCart("success");
  const cartFail = getCart("no-minimum-order");
  await db.collection(CARTS).doc(cartIdSuccess).set(cartSuccess);
  await db.collection(CARTS).doc(cartIdFail).set(cartFail);
  wrapped = testFunctions.wrap(createOrder);
});

afterAll(async () => {
  await db.collection(CARTS).doc(cartIdSuccess).delete();
  await db.collection(CARTS).doc(cartIdFail).delete();
});

describe("createOrder", () => {
  it("should throw an error because of minimum order amount", async () => {
    const data: RequestBody = {
      cartId: cartIdFail,
      payment: "cash",
      platform: "web",
      service: "kjd",
    };

    await expect(wrapped(data)).rejects.toThrow(HttpsError);
  });

  it("should fail without cartId", async () => {
    const wrapped = testFunctions.wrap(createOrder);
    const data = {
      // cartId: "fb9zDteYF1lLowZ5znDH",
      payment: "cash",
      platform: "web",
      service: "kjd",
    };

    const options: ContextOptions = {
      auth: {
        uid: "user",
      },
    };

    await expect(wrapped(data, options)).rejects.toThrow(HttpsError);
  });

  it("should create an order", async () => {
    const data = {
      cartId: cartIdSuccess,
      payment: "cash",
      platform: "web",
      service: "kjd",
    };

    const options: ContextOptions = {
      auth: {
        uid: "lHYojBWozigmML8q1gM9iSeuI6G2",
      },
    };

    const res = await wrapped(data, options);
    await expect(res).toEqual("Order created!");
  }, 5000);

  it("should create an order from kjdCart", async () => {
    const kjdCart = getCart("kjd-cart");
    const data: RequestBody = {
      cartId: "kjdCart",
      payment: "cash",
      platform: "web",
      service: "kjd",
      cart: kjdCart,
    };

    const options: ContextOptions = {
      auth: {
        uid: "lHYojBWozigmML8q1gM9iSeuI6G2",
      },
    };

    const res = await wrapped(data, options);
    await expect(res).toEqual("Order created!");
  });

  it("should create a preorder from kjdCart", async () => {
    const kjdCart = getCart("kjd-cart-preorder");
    const data: RequestBody = {
      cartId: "kjdCart",
      payment: "cash",
      platform: "web",
      service: "kjd",
      cart: kjdCart,
    };

    const options: ContextOptions = {
      auth: {
        uid: "lHYojBWozigmML8q1gM9iSeuI6G2",
      },
    };

    const res = await wrapped(data, options);
    await expect(res).toEqual("Order created!");
  });
});
