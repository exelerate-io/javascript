/* eslint-disable vars-on-top */

import setEnv from "./startup/environment";
import { Environment } from "../../../klikni-jadi-api/src/types/environment";

declare global {
  // eslint-disable-next-line no-var
  var env: Environment;
}

const setGlobalEnvironment = (): void => {
  if (process.env.NODE_ENV === "local") {
    setEnv();
  }
  global.env = process.env.NODE_ENV as Environment;
};

export default setGlobalEnvironment;
