import { exec } from "child_process";
import type { Page } from "playwright";
import {
  Client,
  Environment,
  executeRuntimeScript,
  setupAnonBrowserWithContext,
} from "@anon/sdk-typescript";
import { getSdkClientIdFromIdToken } from "./decode-jwt.js";
import Fastify from 'fastify'

// Get your API Key at https://console.anon.com
const API_KEY: string = "YOUR API KEY HERE";

// Pick which app you'd like to link
const APP: string = "linkedin";
const INITIAL_URL: string = "https://linkedin.com"
const APP_USER_ID: string = "default-app-user";
const ENVIRONMENT: Environment = "local";

// Choose your the action you want to run based on the app selected
// Check out other out-of-the-box actions at https://github.com/anon-dot-com/actions
import { LinkedIn, NetworkHelper } from "@anon/actions";
const RUN_ACTION = LinkedIn.createPost(
  new NetworkHelper(5000 /* 5 seconds */),
  `I'm testing Anon.com and automatically generated this post in < 5 minutes.
  Find out more about using Anon to automate your agent actions at Anon.com.`
);
// const RUN_ACTION = LinkedIn.sendMessage(
//   new NetworkHelper(5000 /* 5 seconds */),
//   "YOUR CONNECTION'S NAME",
//   `I'm testing Anon.com and automatically send this message in < 5 minutes.
//   Find out more about using Anon to automate your agent actions at Anon.com.`
// );
// const RUN_ACTION = async (page: Page) => {
//   // perform any actions you'd like!
//   await page.waitForTimeout(5000);
//   // await page.goto("https://myactivity.google.com");
//   await page.waitForTimeout(5000);
// };
    
const BACKEND_PORT: number = 4001

// Start your backend server that uses the Anon Runtime SDK
const backend = async () => {
  const fastify = Fastify({
    logger: true
  });

  // Declare a route to get a link url
  fastify.get('/linkUrl', async (req, reply) => {
    // Issue an app user id token
    const res = await fetch(
      `http://svc.${ENVIRONMENT}.anon.com/org/appUserIdToken`, 
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
    );
    const { appUserIdToken } = await res.json() as { appUserIdToken: string };
    console.log(`Generated appUserIdToken: ${appUserIdToken}\n`);

    // get the sdk client id
    const clientId = getSdkClientIdFromIdToken(appUserIdToken);

    // generate a random state for secure verification
    const state = JSON.stringify({
      verification: "randomString"
    });

    // generate a link url
    const params: URLSearchParams = new URLSearchParams({
      clientId,
      app: APP,
      appUserIdToken,
      redirectUrl: `http://localhost:${BACKEND_PORT}/redirect`,
      state
    });
    
    const generateLinkUrl: string = `http://link.svc.${ENVIRONMENT}.anon.com/api/url?${params.toString()}`;
    console.log(`Sending request to generate linkUrl`);
    
    const generateLinkUrlRes = await fetch(generateLinkUrl);
    const { url: linkUrl } = await generateLinkUrlRes.json() as { url: string };
  
    // return the linkUrl to your application
    return { linkUrl };
  })

  // Declare a route for the redirect url
  fastify.get('/redirect', async (req, res) => {
    const account = {
      app: APP,
      userId: APP_USER_ID,
    };
  
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
        cleanupOptions: { 
          closePage: true, 
          closeBrowserContext: true 
        },
        run: RUN_ACTION,
      });
      console.log("Runtime script execution completed.");
      process.exit(0);
    } catch (error) {
      console.error("Error:", error);
    }
  }); 

  // Run the server!
  try {
    await fastify.listen({ port: BACKEND_PORT })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

// Start your frontend server that launches Anon Link 
const frontend = async () => {  
  // Get the link url
  const res = await fetch(`http://localhost:${BACKEND_PORT}/linkUrl`);
  const { linkUrl } = await res.json() as { linkUrl: string };

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

  openBrowser(linkUrl);
}

backend().then(frontend);