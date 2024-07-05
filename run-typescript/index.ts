import {
  Client,
  setupAnonBrowserWithContext,
  executeRuntimeScript,
  Environment,
} from "@anon/sdk-typescript";
import { Page } from "playwright";
import dotenv from "dotenv";

import { fileURLToPath } from "url";
import path from "path";

// Load environment variables from parent .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// this is the "sub" field of your user's JWT
const APP_USER_ID = process.env.ANON_APP_USER_ID!;
// create a server SdkClient and use its api_key
// for testing, can alternately use an admin member's api_key
const API_KEY = process.env.ANON_API_KEY!;
// "sandbox" or "prod", based on your credentials
const ANON_ENV = process.env.ANON_ENV! as Environment;
// check out our list of supported apps here: https://docs.anon.com/docs/getting-started/overview
// this should align with a session you uploaded with the web-link example
const APP = "linkedin";

if (!APP_USER_ID) {
  console.error("Error: Please set the ANON_APP_USER_ID environment variable.");
  process.exit(1);
}
if (!API_KEY) {
  console.error("Error: Please set the ANON_API_KEY environment variable.");
  process.exit(1);
}
if (!ANON_ENV) {
  console.error("Error: Please set the ANON_ENV environment variable.");
  process.exit(1);
}

const account = {
  app: APP,
  userId: APP_USER_ID,
};

const client = new Client({
  environment: ANON_ENV,
  apiKey: API_KEY,
});

const appUrls: { [key: string]: string } = {
  amazon: "https://amazon.com",
  instagram: "https://instagram.com",
  linkedin: "https://linkedin.com",
  uber: "https://uber.com",
};

const amazonAddHeadphonesToCart = async (page: Page) => {
  // Focus on the search bar using the known CSS selector for Amazon's search input
  await page.focus("#twotabsearchtextbox");
  await page.keyboard.type("AirPods");
  await page.keyboard.press("Enter");

  // Wait for navigation after the search
  await page.waitForNavigation();
  await page.waitForSelector(".s-main-slot.s-result-list");

  // todo: Fix playwright to select first item on page
  await page.goto(
    "https://www.amazon.com/Apple-AirPods-Charging-Latest-Model/dp/B07PXGQC1Q",
  );

  // Wait for the "Add to Cart" button to be visible and enabled
  const addToCartButton = await page.waitForSelector("#add-to-cart-button", {
    state: "visible",
  });

  // Click on the "Add to Cart" button
  if (addToCartButton) {
    await addToCartButton.click();
  } else {
    console.log("Add to Cart button not found");
  }

  await page.waitForSelector("#attachSiNoCoverage", {
    state: "visible",
    timeout: 5000, // Wait for up to 5 seconds
  });
  await page.click("#attachSiNoCoverage");
};

const amazonCheckoutHeadphones = async (page: Page) => {
  await page.click("a#nav-cart"); // This is a typical selector for the cart on Amazon

  // Wait for the cart page to load
  await page.waitForSelector('input[name="proceedToRetailCheckout"]', {
    state: "visible",
  });

  // Click on the "Proceed to Checkout" button
  await page.click('input[name="proceedToRetailCheckout"]'); // Adjust the selector if needed based on your inspection

  // Wait for the checkout page to load completely
  await page.waitForSelector("#submitOrderButtonId", {
    state: "visible",
  });

  // Click the button by targeting the input inside the span with the specific name attribute
  await page.waitForTimeout(3000);
  await page.click('input[name="placeYourOrder1"]');
};

const linkedInSendMessage = async (page: Page) => {
  // send a message
  const recipient = "Daniel Mason";
  const message = `hello from Anon! :) The time is ${new Date().toLocaleTimeString()}`;

  await page.getByPlaceholder("Search messages").pressSequentially(recipient);
  await page.waitForTimeout(1000);
  await page.getByPlaceholder("Search messages").press("Enter");
  await page.waitForTimeout(1000);

  await page
    .getByRole("listitem")
    .filter({ hasText: recipient, hasNot: page.locator("#ember") })
    .first()
    .click();
  await page.waitForTimeout(1000);

  await page.getByLabel("Write a message").pressSequentially(message);
  await page.waitForTimeout(1000);

  await page.getByRole("button", { name: "Send", exact: true }).click();
  await page.waitForTimeout(3000);
};

const actions: { [key: string]: any } = {
  amazon: async (page: Page) => {
    console.log("Amazon: starting action!");
    await page.goto("https://amazon.com");

    await amazonAddHeadphonesToCart(page);
    // await amazonCheckoutHeadphones(page);
    await page.waitForTimeout(100000);
  },
  instagram: async (page: Page) => {
    // toy example: navigate to messages
    console.log("Instagram: navigating to messages!");
    await page.goto("https://instagram.com");
    await page.mainFrame().waitForLoadState();

    await page.goto("https://instagram.com/direct/inbox");
    await page.mainFrame().waitForLoadState();
  },
  linkedin: async (page: Page) => {
    console.log("LinkedIn: navigating to messages!");
    await page.goto("https://linkedin.com");
    await page.mainFrame().waitForLoadState();

    await page.goto('https://linkedin.com/messaging', { waitUntil: 'load', timeout: 5000 }); // 5 seconds
    await page.mainFrame().waitForLoadState();

    // await linkedInSendMessage(page);
  },
  uber: async (page: Page) => {
    console.log("Uber: navigating to ride booking page!");
    await page.goto("https://uber.com");
    await page.mainFrame().waitForLoadState();

    await page.goto("https://uber.com/go/pickup");
    await page.waitForTimeout(300000);
  },
};

const main = async () => {
  console.log(
    `Requesting ${account.app} session for app user id "${APP_USER_ID}"…`,
  );
  const { browser, } = await setupAnonBrowserWithContext(
    client,
    account,
    { type: "managed", input: { } },
  );

  const page = browser.contexts()[0].pages()[0];

  await executeRuntimeScript({
    client,
    account,
    target: { page: page },
    initialUrl: appUrls[account.app],
    cleanupOptions: {closePage: true, closeBrowserContext: true},
    run: actions[account.app],
  });
  const accountInfo = { ownerId: APP_USER_ID, domain: account.app };

  const demoDeleteSession = async () => {
    // Demo `getSessionStatus`, `deleteSession`
    let sessionStatus = await client.getSessionStatus({ account: accountInfo });
    console.log(
      `Before deleting session, client session status: ${JSON.stringify(
        sessionStatus,
      )}`,
    );

    await client.deleteSession({ account: accountInfo });
    console.log(`Session deleted for ${JSON.stringify(accountInfo)}`);

    sessionStatus = await client.getSessionStatus({ account: accountInfo });
    console.log(
      `After deleting session, client session status: ${JSON.stringify(
        sessionStatus,
      )}`,
    );
  };

  // await demoDeleteSession();
};

main();
