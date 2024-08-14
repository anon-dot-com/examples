import { anon as AnonLink, AnonRuntime } from "@anon/sdk-browser-extension";
import type { Environment } from "@anon/sdk-typescript";

// launch anon sdk
const environment = process.env.PLASMO_PUBLIC_ANON_ENV as Environment;
const anon = new AnonRuntime({
  client: {
    environment,
    authToken: process.env.PLASMO_PUBLIC_ANON_API_KEY,
  },
});

anon.start();

AnonLink({
  environment,
});
