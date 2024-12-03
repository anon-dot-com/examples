import { AnonRuntime } from "@anon/sdk-typescript";
import { IntegrationManager } from "./manager/manager";

const anon = new AnonRuntime({ apiKey: "" });

// The username of the user whose account to use
const appUserId = "";
// The app sessions to inject
const apps = ["linkedin"];

// The action to be performed
const action = async (page) => {
  const integrations = new IntegrationManager(page, apps);
  
  await page.goto("https://linkedin.com");

  // to use a specific integration, use the syntax integrations.$integrationName.$methodName()
  // note: this syntax will only work if the integration is in the apps array and the app is supported in the integrations folder
  await integrations.linkedin.postToLinkedIn("Hello, world!");
}


// Run the action
(async () => {
  const { result, liveStreamingUrl } = await anon.run({
    appUserId,
    apps,
    action
  });

  // You can use the liveStreamingUrl to watch your action be performed.
  console.log(liveStreamingUrl);

  // Await the successful completion of the action
  await result;
})();
