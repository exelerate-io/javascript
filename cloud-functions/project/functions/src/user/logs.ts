import { logger } from "../config";

export const userCartDeleted = (userId: string, cartId: string) => {
  logger.log(`Deleted cart with id [${cartId}] from user with id [${userId}]`);
};
