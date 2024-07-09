import { Page } from "playwright";
import { waitForPageLoad, retryWithBackoff, takeScreenshot } from "../browserHelpers";
import { NETWORK_TIMEOUT } from "../config";

const LINKEDIN_URL = "https://www.linkedin.com";

export const linkedInCreatePost = async (page: Page) => {
  console.log("Starting linkedInCreatePost function...");

  console.log("Step 1: Navigating to LinkedIn homepage...");
  await retryWithBackoff(async () => {
    await page.goto(LINKEDIN_URL, { timeout: NETWORK_TIMEOUT });
    console.log("Successfully navigated to LinkedIn homepage.");
  });
  await takeScreenshot(page, "linkedin", "1-linkedin-homepage");

  console.log("Step 2: Waiting for page to load...");
  await waitForPageLoad(page);
  await takeScreenshot(page, "linkedin", "2-after-page-load");

  console.log("Step 3: Locating 'Start a post' button...");
  await retryWithBackoff(async () => {
    const startPostButton = page.getByRole('button', { name: 'Start a post' });
    await startPostButton.waitFor({ state: 'visible', timeout: NETWORK_TIMEOUT });
    console.log("'Start a post' button located and visible.");
  });
  await takeScreenshot(page, "linkedin", "3-before-clicking-start-post");

  console.log("Step 4: Clicking 'Start a post' button...");
  await retryWithBackoff(async () => {
    await page.getByRole('button', { name: 'Start a post' }).click();
    console.log("'Start a post' button clicked successfully.");
  });
  await takeScreenshot(page, "linkedin", "4-after-clicking-start-post");

  console.log("Step 5: Waiting for post creation modal...");
  await retryWithBackoff(async () => {
    await page.waitForSelector('div[role="dialog"]', { state: 'visible', timeout: NETWORK_TIMEOUT });
    console.log("Post creation modal is visible.");
  });
  await takeScreenshot(page, "linkedin", "5-post-creation-modal");

  console.log("Step 6: Locating and interacting with text editor...");
  const postContent = "I'm testing Anon.com and automatically generated this post in < 5 minutes.\nFind out more about using Anon to automate your agent automations at Anon.com.";
  await retryWithBackoff(async () => {
    const textEditor = page.getByRole('textbox', { name: 'Text editor for creating' });
    await textEditor.waitFor({ state: 'visible', timeout: NETWORK_TIMEOUT });
    await textEditor.fill(postContent);
    console.log("Post content written successfully.");
  });
  await takeScreenshot(page, "linkedin", "6-after-writing-post");

  console.log("Step 7: Locating and clicking 'Post' button...");
  await retryWithBackoff(async () => {
    const postButton = page.getByRole('button', { name: 'Post', exact: true });
    await postButton.waitFor({ state: 'visible', timeout: NETWORK_TIMEOUT });
    await postButton.click();
    console.log("'Post' button clicked successfully.");
  });
  await takeScreenshot(page, "linkedin", "7-after-clicking-post");

  console.log("Step 8: Waiting for post confirmation...");
  await Promise.race([
    page.waitForURL('**/feed/**', { timeout: NETWORK_TIMEOUT }),
    page.waitForSelector('[aria-label="Post successful"]', { state: 'visible', timeout: NETWORK_TIMEOUT })
  ]).then(() => console.log("Post confirmation received."))
    .catch(() => console.log("Post confirmation timeout, but proceeding."));
  await takeScreenshot(page, "linkedin", "8-after-posting");

  console.log("LinkedIn post creation process completed.");
};
