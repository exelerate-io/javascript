// import db from './startup/db';
import logger from "winston";
import express from "express";
import routes from "./startup/routes";
import setGlobalEnvironment from "./global";
import logging from "./startup/logging";

setGlobalEnvironment();
logging();

const app = express();
routes(app);

const port = process.env.PORT || 6000;
const server = app.listen(port, () => logger.info(`Listening on port ${port}`));

export default server;
