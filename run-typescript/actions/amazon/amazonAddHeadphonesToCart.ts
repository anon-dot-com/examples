import { Page } from "playwright";
import { waitForPageLoad, retryWithBackoff, takeScreenshot } from "../browserHelpers";
import { NETWORK_TIMEOUT, MAX_RETRIES } from "../config";

const AMAZON_URL = "https://amazon.com";

export const amazonAddHeadphonesToCart = async (page: Page) => {
    console.log("Starting amazonAddHeadphonesToCart function...");

    // Step 0: Navigate to Amazon
    console.log("Step 0: Navigating to Amazon homepage...");
    await retryWithBackoff(async () => {
      await page.goto(AMAZON_URL, { timeout: NETWORK_TIMEOUT });
      console.log("Successfully navigated to Amazon.");
      await takeScreenshot(page, "amazon", "0-amazon-homepage-loaded");
    });

    // Step 1: Focus on the search bar and type "AirPods"
    console.log("Step 1: Searching for AirPods...");
    await retryWithBackoff(async () => {
      await page.focus("#twotabsearchtextbox");
      await page.keyboard.type("AirPods");
      await page.keyboard.press("Enter");
      console.log("Search submitted for AirPods.");
      await takeScreenshot(page, "amazon", "1-search-submitted");
    });

    // Step 2: Wait for navigation after the search
    console.log("Step 2: Waiting for search results...");
    await retryWithBackoff(async () => {
      await page.waitForNavigation();
      await page.waitForSelector(".s-main-slot.s-result-list");
      console.log("Search results loaded.");
      await takeScreenshot(page, "amazon", "2-search-results-loaded");
    });

    // TODO: automagically select first product
    // Step 3: Navigate to Specific Product Page
    console.log("Step 3: Navigating to AirPods product page...");
    await retryWithBackoff(async () => {
      await page.goto("https://www.amazon.com/Apple-AirPods-Charging-Latest-Model/dp/B07PXGQC1Q");
      console.log("Navigated to AirPods product page.");
      await takeScreenshot(page, "amazon", "3-product-page-loaded");
    });

    // Step 4: Wait for "Add to Cart" button to be visible and enabled
    console.log("Step 4: Waiting for 'Add to Cart' button...");
    await retryWithBackoff(async () => {
      const addToCartButton = await page.waitForSelector("#add-to-cart-button", { state: "visible" });
      console.log("'Add to Cart' button is visible and enabled.");
      await takeScreenshot(page, "amazon", "4-add-to-cart-visible");
    });

    // Step 5: Click on the "Add to Cart" button
    console.log("Step 5: Clicking 'Add to Cart' button...");
    await retryWithBackoff(async () => {
      const addToCartButton = await page.$("#add-to-cart-button");
      if (addToCartButton) {
        await addToCartButton.click();
        console.log("'Add to Cart' button clicked successfully.");
        await takeScreenshot(page, "amazon", "5-add-to-cart-clicked");
      } else {
        console.log("Add to Cart button not found");
      }
    });

    // Step 6: Handle Insurance Option
    console.log("Step 6: Handling insurance option...");
    await retryWithBackoff(async () => {
      await page.waitForSelector("#attachSiNoCoverage", { state: "visible", timeout: 5000 });
      await page.click("#attachSiNoCoverage");
      console.log("Insurance option handled.");
      await takeScreenshot(page, "amazon", "6-insurance-option-handled");
    });

    console.log("Amazon Airpods addition to cart process completed.");
};
