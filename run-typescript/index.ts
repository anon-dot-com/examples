import {
  Client,
  setupAnonBrowserWithContext,
  executeRuntimeScript,
  Environment,
} from "@anon/sdk-typescript";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { APP_URLS, AppName, DO_DELETE_SESSION, NETWORK_TIMEOUT } from "./actions/config.js";
import { LinkedIn, NetworkHelper } from "@anon/actions";
import { Page } from "playwright-core";

console.log("Starting script execution...");

// Load environment variables from parent .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });
console.log("Environment variables loaded.");

// Configuration
const APP_USER_ID = process.env.ANON_APP_USER_ID!;
const API_KEY = process.env.ANON_API_KEY!;
const ANON_ENV = process.env.ANON_ENV! as Environment;
const APP: AppName = "linkedin";

// Choose your the action you want to run based on the app selected
// Check out other out-of-the-box actions at https://github.com/anon-dot-com/actions
const networkHelper = new NetworkHelper(NETWORK_TIMEOUT)
let runAction = LinkedIn.createPost(networkHelper,
  `I'm testing Anon.com and automatically generated this post in < 5 minutes.
   Find out more about using Anon to automate your agent automations at Anon.com.`
);

// You can even write your own custom action and use the Anon actions to help you write it
const sendMessageToConnections = (messageText: string, n: number) => async (page: Page) => {
  await networkHelper.waitForPageLoad(page);
  await networkHelper.waitForNetworkIdle(page)
  // Get all connections
  const connections = await LinkedIn.getConnections(networkHelper)(page);

  for (const engineer of connections.slice(0, n)) {
    try {

      // Navigate to the engineer's profile
      await page.goto(engineer.profileUrl)
      await networkHelper.waitForPageLoad(page);

      // Send the message
      await LinkedIn.sendMessageOnProfilePage(networkHelper, messageText, page);

      console.log(`Message sent to ${engineer.name}`);
    } catch (error) {
      console.error(`Failed to send message to ${engineer.name}:`, error);
    }

    // Add a delay between messages to avoid rate limiting
    await page.waitForTimeout(5000); // 5 second delay
  }
}

// Uncomment the code to try out your custom action
// runAction = sendMessageToConnections(
//   `Hi Friend, I used the Anon SDK to send you this message. 
//   Try it out at https://docs.anon.com/docs/general/quickstart`,
//   5);






// Validate environment variables
[
  { name: "ANON_APP_USER_ID", value: APP_USER_ID },
  { name: "ANON_API_KEY", value: API_KEY },
  { name: "ANON_ENV", value: ANON_ENV },
].forEach(({ name, value }) => {
  if (!value) {
    console.error(`Error: Please set the ${name} environment variable.`);
    process.exit(1);
  }
});

console.log("Configuration set:");
console.log(`APP_USER_ID: ${APP_USER_ID ? "Set" : "Not set"}`);
console.log(`API_KEY: ${API_KEY ? "Set" : "Not set"}`);
console.log(`ANON_ENV: ${ANON_ENV}`);
console.log(`APP: ${APP}`);

const account = {
  app: APP,
  userId: APP_USER_ID,
};

console.log("Creating Anon client...");
const client = new Client({
  environment: ANON_ENV,
  apiKey: API_KEY,
});
console.log("Anon client created.");

type AccountInfo = { ownerId: string, domain: string }
const accountInfo: AccountInfo = { ownerId: APP_USER_ID, domain: account.app };

const main = async () => {
  console.log(`Requesting ${account.app} session for app user id "${APP_USER_ID}"...`);
  try {
    console.log("Setting up Anon browser with context...");
    const { browser, browserContext } = await setupAnonBrowserWithContext(
      client,
      account,
      { type: "local", input: {headless: false} },
    );
    console.log("Anon browser setup complete.");

    console.log("Executing runtime script...");
    await executeRuntimeScript({
      client,
      account,
      target: { browserContext },
      initialUrl: APP_URLS[APP],
      cleanupOptions: { closePage: true, closeBrowserContext: true },
      run: runAction,
    });
    console.log("Runtime script execution completed.");


    // Demo `getSessionStatus`
    let sessionStatus = await client.getSessionStatus({ account: accountInfo });
    console.log(`Client session status: ${JSON.stringify(sessionStatus)}`);

    if (DO_DELETE_SESSION) {
      await demoDeleteSession(accountInfo);
    }
    console.log("Script execution finished successfully.");
  } catch (error) {
    console.error("Error in main function:", error);
  }
};

const demoDeleteSession = async (accountInfo: AccountInfo) => {
  // Demo `deleteSession`
  await client.deleteSession({ account: accountInfo });
  console.log(`Session deleted for ${JSON.stringify(accountInfo)}`);

  const sessionStatus = await client.getSessionStatus({ account: accountInfo });
  console.log(`After deleting session, client session status: ${JSON.stringify(sessionStatus)}`);
}

console.log("Starting main function...");
main()
  .then(() => console.log("Script execution completed."))
  .catch(error => console.error("Unhandled error in main:", error));
