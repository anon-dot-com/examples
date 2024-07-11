import { Page } from "playwright";
import { waitForNetworkIdle, retryWithBackoff, takeScreenshot, waitForPageLoad } from "../browserHelpers";
import { NETWORK_TIMEOUT } from "../config";


const username = ""
const message = ""

export const instagramNavigateToMessages = async (page: Page) => {
  const INSTAGRAM_MESSAGES_URL = `https://instagram.com/${username}`;
  console.log("Starting instagramNavigateToMessages function...");

  console.log("Step 1: Navigating to Instagram Messages...");
  await retryWithBackoff(async () => {
    await page.goto(INSTAGRAM_MESSAGES_URL, { timeout: NETWORK_TIMEOUT });
    console.log("Successfully navigated to Instagram Messages.");
  });
  // await takeScreenshot(page, "instagram", "1-instagram-messages");
  console.log("Step 2: Waiting for page to load...");
  await waitForNetworkIdle(page);
  await waitForPageLoad(page)
  await page.getByRole('button', { name: message }).click();
  await page.getByRole('paragraph').click();
  await page.getByLabel('Message', { exact: true }).fill('test');
  await page.getByRole('button', { name: 'Send' }).click();
  // await takeScreenshot(page, "instagram", "2-after-page-load");
  console.log("Completed instagramNavigateToMessages function...");
}

export const getRecentNotification = async (page: Page) => {
  const INSTAGRAM_MESSAGES_URL = `https://instagram.com/notifications`;
  console.log("Starting getRecentNotification function...");

  console.log("Step 1: Navigating to Instagram Notifications...");
  await retryWithBackoff(async () => {
    await page.goto(INSTAGRAM_MESSAGES_URL, { timeout: NETWORK_TIMEOUT });
    console.log("Successfully navigated to Instagram Notifications.");
  });

  await waitForNetworkIdle(page);
  await waitForPageLoad(page);

  console.log("Step 2: Extracting text content...");
  const textContent = await page.evaluate(() => {
    return document.body.innerText;
  });

  console.log("Text content of the page:", textContent);
};
