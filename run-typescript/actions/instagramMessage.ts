import { Page } from "playwright";
import { waitForNetworkIdle, retryWithBackoff, takeScreenshot } from "../browserHelpers";
import { NETWORK_TIMEOUT } from "../config";

const INSTAGRAM_MESSAGES_URL = "https://instagram.com/direct/inbox";

export const instagramNavigateToMessages = async (page: Page) => {
  console.log("Starting instagramNavigateToMessages function...");

  console.log("Step 1: Navigating to Instagram Messages...");
  await retryWithBackoff(async () => {
    await page.goto(INSTAGRAM_MESSAGES_URL, { timeout: NETWORK_TIMEOUT });
    console.log("Successfully navigated to Instagram Messages.");
  });
  await takeScreenshot(page, "instagram", "1-instagram-messages");

  console.log("Step 2: Waiting for page to load...");
  await waitForNetworkIdle(page);
  await takeScreenshot(page, "instagram", "2-after-page-load");

  console.log("Completed instagramNavigateToMessages function...");
}
