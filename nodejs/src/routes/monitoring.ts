import express from "express";

const router = express.Router();

router.get(
  "/health",
  (request: express.Request, response: express.Response) => {
    response.send("OK");
  }
);

export default router;
