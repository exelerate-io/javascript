import * as path from "path";
import * as fs from "fs";
import { config } from "dotenv";

const setEnv = () => {
  const rootdir: string = path.resolve(__dirname, "../../");
  const envPath = path.resolve(rootdir, ".env.local");

  if (!fs.existsSync(envPath)) {
    throw new Error(".env file is missing in root directory");
  }

  config({ path: envPath });
};

export default setEnv;
