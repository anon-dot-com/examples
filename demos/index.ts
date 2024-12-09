import * as dotenv from 'dotenv';
import { AnonRuntime } from "@anon/sdk-typescript";
import { IntegrationManager } from "./manager/manager";
import type { Page } from "playwright";
import type { BrowserInput } from "@anon/sdk-typescript";

dotenv.config();

if (!process.env.ANON_API_KEY) {
  throw new Error("ANON_API_KEY environment variable is required");
}

if (!process.env.ANON_APP_USER_ID) {
  throw new Error("ANON_APP_USER_ID environment variable is required"); 
}

const anon = new AnonRuntime({
  apiKey: process.env.ANON_API_KEY,
  environment: "sandbox"
});

const appUserId = process.env.ANON_APP_USER_ID;

// The app sessions to inject
const apps = ["linkedin"];

// The action to be performed
const action = async (page: Page) => {
  const integrations = new IntegrationManager(page, apps);

  await page.goto("https://linkedin.com");

  // To use a specific integration, use the syntax integrations.$integrationName.$methodName()
  // Note: this syntax will only work if the integration is in the apps array and the app is supported in the integrations folder
  await integrations.linkedin.post("Hello, world!");
};

// Run the action with type assertion
(async () => {
  const { result, liveStreamingUrl } = await anon.run({
    appUserId,
    apps,
    action: action as BrowserInput<void>["action"],
  });

  // You can use the liveStreamingUrl to watch your action be performed.
  console.log(liveStreamingUrl);

  // Await the successful completion of the action
  await result;
})();
