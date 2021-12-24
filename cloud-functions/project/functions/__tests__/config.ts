import test from "firebase-functions-test";
import { Config } from "../src/types/config";

process.env.GCLOUD_PROJECT = "klikni-jadi-dev";
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

const testFunctions = test({
  databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
  projectId: process.env.GCLOUD_PROJECT,
  storageBucket: `${process.env.GCLOUD_PROJECT}.appspot.com`,
});

const envConfig: Config = {
  elastic: {
    username: "elastic",
    password: "m6dq03twWuhCn2vOfw94MSkI",
    cloud_id:
      "klikni-jadi-platform:ZXVyb3BlLXdlc3QzLmdjcC5jbG91ZC5lcy5pbyQ5MjEyOTMxOGM0MzM0Zjk3YWFjNmMwMjE3OTI0NTI0ZCQwNGRlZGU5Y2I5MTg0MjQwOWRhYTU2YjQxMTBlOTczYQ==",
    index: "restaurants_dev",
  },
  devs_hive: {
    url: "https://kj.api.my-app.host/api",
    secret: "24F4BCC43BFA66CC864644EC3F85DD8FFCB1DEF8C3377045478C8625D7C0CDEA",
    api_key:
      "d0972be7369849984a33b34148e6740fafcaa5ac7cd4573bdd687430c36e6c00ed882d87ca0caa1a59d6ccedc5af9e6f23b9599c72f790eccc22524abdb47788",
  },
  halk: {
    client_id: "180000103",
    store_key: "SKEY1384",
  },
  cloud_run: {
    url: "https://klikni-jadi-api-7mrjes5qaq-ey.a.run.app",
  },
  client: {
    url: "",
  },
};

testFunctions.mockConfig(envConfig);

export { testFunctions };
