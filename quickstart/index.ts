import { exec } from "child_process";
import http from 'http';
import type { Page } from "playwright";
import {
  Client,
  Environment,
  executeRuntimeScript,
  setupAnonBrowserWithContext,
} from "@anon/sdk-typescript";
import { getSdkClientIdFromIdToken } from "./decode-jwt.js";

// Get your API Key at https://console.anon.com
const API_KEY: string = "YOUR API KEY HERE";

// Pick which app you'd like to link
const APP: string = "linkedin";
const INITIAL_URL: string = "https://linkedin.com"
const APP_USER_ID: string = "quickstart-user";
const ENVIRONMENT: Environment = "sandbox"
// const RUN_ACTION = async (page: Page) => {
//   // perform any actions you'd like!
//   await page.waitForTimeout(100000);
// };

// Choose your the action you want to run based on the app selected
// Check out other out-of-the-box actions at https://github.com/anon-dot-com/actions
import { LinkedIn, NetworkHelper } from "@anon/actions";
// const RUN_ACTION = LinkedIn.createPost(
//   new NetworkHelper(5000 /* 5 seconds */),
//   `I'm testing Anon.com and automatically generated this post in < 5 minutes.
//   Find out more about using Anon to automate your agent automations at Anon.com.`
// );
const RUN_ACTION = LinkedIn.sendMessage(
  new NetworkHelper(5000 /* 5 seconds */),
  "Joshua Tomazin",
  `I'm testing Anon.com and automatically generated this post in < 5 minutes.
  Find out more about using Anon to automate your agent automations at Anon.com.`
);

// Start your backend server that uses the Anon Runtime SDK
const backend = async () => {

  // const hostname = '127.0.0.1';
  // const port = 3000;

  // const server = http.createServer((req, res) => {
  //   // a session was linked, run it!
  //   res.statusCode = 200;
  //   res.setHeader('Content-Type', 'text/plain');
  //   res.end('Hello, World!\n');
  // });

  // server.listen(port, hostname, () => {
  //   console.log(`Server running at http://${hostname}:${port}/`);
  // }); 

  const account = {
    app: APP,
    userId: APP_USER_ID,
  };

  console.log("Creating Anon client...");
  const client = new Client({
    environment: ENVIRONMENT,
    apiKey: API_KEY,
  });

  console.log(`Requesting ${account.app} session for app user id "${APP_USER_ID}"...`);
  try {
    console.log("Setting up Anon browser with context...");
    const { browserContext } = await setupAnonBrowserWithContext(
      client,
      account,
      { type: "local", input: { headless: false } },
    );
    console.log("Anon browser setup complete.");

    console.log("Executing runtime script...");
    await executeRuntimeScript({
      client,
      account,
      target: { browserContext },
      initialUrl: INITIAL_URL,
      cleanupOptions: { closePage: true, closeBrowserContext: true },
      run: RUN_ACTION,
    });
    console.log("Runtime script execution completed.");

    // Demo `getSessionStatus`
    const sessionStatus = await client.getSessionStatus({ 
      account: { 
        ownerId: APP_USER_ID, 
        domain: account.app 
      } 
    });
    console.log(`Client session status: ${JSON.stringify(sessionStatus)}`);
    console.log("Script execution finished successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
}

const frontend = async () => {
  // Open your system's default web browser
  const openBrowser = (url: string) => {
      let command: string;
      switch (process.platform) {
          case 'darwin': // macOS
              command = `open "${url}"`;
              break;
          case 'win32': // Windows
              command = `start "${url}"`;
              break;
          case 'linux': // Linux
              command = `xdg-open "${url}"`;
              break;
          default:
              throw new Error('Unsupported operating system: ' + process.platform);
      }
      exec(command);
  };

  // Link your user's session
  const { appUserIdToken }: { appUserIdToken: string } = await fetch(
    `https://svc.${ENVIRONMENT}.anon.com/org/appUserIdToken`, 
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        appUserId: APP_USER_ID
      })
    }
  ).then(res => res.json());

  const clientId = getSdkClientIdFromIdToken(appUserIdToken);

  const linkParams = {
    app: APP,
    clientId,
    appUserIdToken,
    environment: ENVIRONMENT,
    company: "Anonymity Labs",
    // Any logo url
    companyLogo: "https://avatars.githubusercontent.com/u/132958123?s=48&v=4",
    // ID of the Anon Link Extension 
    // https://chromewebstore.google.com/detail/anon-link/lbgbplnejdpahnfmnphghjlbedpjjbgd
    chromeExtensionId: 'nhidfambhijngahjehgmldpnanljilid',
  };

  const linkUrl = `https://link.svc.${ENVIRONMENT}.anon.com?${new URLSearchParams(linkParams).toString()}`

  openBrowser(linkUrl);
}

// wait 20 seconds

frontend()
await new Promise(resolve => setTimeout(resolve, 2000));
backend()