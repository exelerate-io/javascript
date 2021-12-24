import { getDeliveryTime } from "../../src/order/handleOrderChange";

describe("getDeliveryTime", () => {
  it("should calculate delivery time", () => {
    const pickupTime = new Date();

    const { minimumDeliveryTime, maximumDeliveryTime } =
      getDeliveryTime(pickupTime);

    expect(minimumDeliveryTime).toEqual(
      new Date(pickupTime.getTime() + 20 * 60000)
    );
    expect(maximumDeliveryTime).toEqual(
      new Date(minimumDeliveryTime.getTime() + 20 * 60000)
    );
  });

  it("should fail with wrong delivery time", () => {
    const pickupTime = new Date();

    const { minimumDeliveryTime, maximumDeliveryTime } =
      getDeliveryTime(pickupTime);

    expect(minimumDeliveryTime).not.toEqual(
      new Date(pickupTime.getTime() + 10 * 60000)
    );
    expect(maximumDeliveryTime).not.toEqual(
      new Date(minimumDeliveryTime.getTime() + 10 * 60000)
    );
  });
});
