/**
 * @file index.ts
 * 
 * Welcome to the Anon run-typescript example! This script demonstrates how to use the Anon Typescript SDK and its actions to interact with various services.
 * 
 * ## Why Use the Anon Typescript SDK?
 * 
 * One of the standout features of the Anon SDK is its ability to run automated delegated actions for your users by utilizing their sessions. 
 * This means you can perform actions on behalf of your users in a secure and efficient manner, enhancing the user experience and streamlining workflows.
 * The Anon SDK provides a powerful and flexible way to automate interactions with different web services. It comes 
 * with a variety of pre-built actions, but the true power lies in its extensibility. By writing your own actions, you 
 * can tailor the SDK to meet your specific needs and workflows.
 * 
 */

import { LinkedIn, NetworkHelper } from "@anon/actions";
import {
  Client,
  Environment,
  SessionNotFoundError,
  executeRuntimeScript,
  setupAnonBrowserWithContext
} from "@anon/sdk-typescript";
import dotenv from "dotenv";
import path from "path";
import { Page } from "playwright";
import { fileURLToPath } from "url";
import { APP_URLS, AppName, DO_DELETE_SESSION, NETWORK_TIMEOUT_MS, } from "./actions/config.js";
import * as YourCustomAction from "./actions/yourCustomAction.js";

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

const networkHelper = new NetworkHelper(NETWORK_TIMEOUT_MS)

const SHOULD_RUN_BUILTIN_ACTION = true;
const APP : { name: AppName, action: (page: Page) => Promise<any> } = {
  name: "linkedin" as AppName,
  
  // Choose your the action you want to run based on the app selected.
  // Check out other out-of-the-box actions at https://github.com/anon-dot-com/actions
  // Make sure that the action that you want to execute matches with the name of the app
  action: (SHOULD_RUN_BUILTIN_ACTION 
    // You can run Anon's out-of-the-box actions
    ? LinkedIn.getConnections(networkHelper)
    // Or you can write your own custom action and run it. Checkout actions/yourCustomAction.ts for more details
    : (page: Page) => 
      YourCustomAction.sendMessageToConnections( 
        networkHelper,
        `Hi Friend, I used the Anon SDK to send you this message. 
            Try it out at https://docs.anon.com/docs/general/quickstart`,
          5)(page))
};

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
console.log(`APP Name: ${APP.name}`);

const account = {
  app: APP.name,
  userId: APP_USER_ID,
};

console.log("Creating Anon client...");
const client = new Client({
  environment: ANON_ENV,
  apiKey: API_KEY,
});
console.log("Anon client created.");

// verify if the user has their session active
const getSessionError = `You are unable to run a ${APP} action since your session cannot be found. Please run the 'connect-react' or 'connect-vue' example to run the example`
try {
  await client.getSession({
    account: {
      ownerId: APP_USER_ID,
      domain: APP.name,
    },
  });
} catch (error) {
  if (error instanceof SessionNotFoundError) {
    throw new Error(getSessionError);
  } else {
    throw error;
  }
}

type AccountInfo = { ownerId: string, domain: string }
const accountInfo: AccountInfo = { ownerId: APP_USER_ID, domain: APP.name };

const main = async () => {
  console.log(`Requesting ${account.app} session for app user id "${APP_USER_ID}"...`);
  try {
    console.log("Setting up Anon browser with context...");
    const { browserContext } = await setupAnonBrowserWithContext(
      client,
      account,
      { type: "local", input: {headless: false} },
    );
    console.log("Anon browser setup complete.");

    console.log("Getting first page from browser context...");
    console.log("Page acquired.");

    console.log("Executing runtime script...");
    const result = await executeRuntimeScript({
      client,
      account,
      target: { browserContext },
      initialUrl: APP_URLS[APP.name],
      cleanupOptions: { closePage: true, closeBrowserContext: true },
      run: APP.action,
    });
    console.log("Runtime script execution completed.");

    console.log(`Script execution result:\n${JSON.stringify(result)}`);

    // Demo `getSessionStatus`
    let sessionStatus = await client.getSessionStatus({ account: accountInfo });
    console.log(`Client session status:\n${JSON.stringify(sessionStatus, null, 2)}`);

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
