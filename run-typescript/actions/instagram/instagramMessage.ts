import { Page } from "playwright";
import { waitForPageLoad, retryWithBackoff, takeScreenshot } from "../browserHelpers";
import { NETWORK_TIMEOUT, MAX_RETRIES } from "../config";

const INSTAGRAM_MESSAGES_URL = "https://instagram.com/direct/inbox";

export const instagramNavigateToMessages = async (page: Page) => {
  console.log("Starting instagramNavigateToMessages function...");

  console.log("Step 1: Navigating to Instagram Messages...");
  await retryWithBackoff(async () => {
    await page.goto(INSTAGRAM_MESSAGES_URL, { timeout: NETWORK_TIMEOUT });
    console.log("Successfully navigated to Instagram Messages.");
  });
  await takeScreenshot(page, "instagram", "1-Instagram-Messages");

  console.log("Step 2: Waiting for page to load...");
  await waitForPageLoad(page);
  await takeScreenshot(page, "instagram", "2-after-page-load");

  console.log("Completed instagramNavigateToMessages function...");
}

// TODO: get this working
export const instagramSendMessageToSelf = async (page: Page) => {
//   // Navigate to Instagram feed (assuming you're already logged in)
//   await page.goto('https://www.instagram.com/');

//   // Click on the profile icon to go to your profile page
//   // Note: This selector might need to be adjusted based on Instagram's current layout
//   await page.click('svg[aria-label="Profile"]');
//   await page.waitForNavigation();

//   // Extract username from the profile page
//   // Note: This selector might need to be adjusted based on Instagram's current layout
//   const usernameElement = await page.$('.username');
//   const myUsername = await page.evaluate(el => el?.textContent, usernameElement);

//   console.log(`Extracted Username: ${myUsername}`);
  const myUsername = "adminitestero";

  // Open the Direct Messages page
  await page.click('text=Direct');
  await page.waitForNavigation();

  // Click on the pencil icon to start a new message
  await page.click('text=New Message');
  await page.waitForSelector('input[placeholder="Search..."]');

  // Type your extracted username to send a message to yourself
  await page.fill('input[placeholder="Search..."]', myUsername!);
  await page.press('input[placeholder="Search..."]', 'Enter');
  await page.waitForSelector('div[role="dialog"] button[type="submit"]');

  // Click on the name that appears (your profile) to open the chat
  await page.click('div[role="dialog"] button[type="submit"]');
  await page.waitForNavigation();

  // Type your message
  const message = "Hello! This is an automated message.";
  await page.fill('textarea[placeholder="Message..."]', message);
  await page.press('textarea[placeholder="Message..."]', 'Enter');

  // Wait a bit before closing the browser
  await page.waitForTimeout(5000);
};
