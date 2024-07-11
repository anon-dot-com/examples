import { Page } from "playwright";
import { NETWORK_TIMEOUT, MAX_RETRIES } from "./config";

export const waitForNetworkIdle = async (page: Page, timeout = NETWORK_TIMEOUT) => {
    console.log("Waiting for network to become idle...");
    try {
        await page.waitForLoadState('networkidle', { timeout });
        console.log("Network is idle.");
    } catch (error) {
        console.warn("Network did not reach idle state within timeout, continuing...");
    }
};

export const waitForPageLoad = async (page: Page) => {
    console.log("Waiting for page to load...");
    try {
        await page.waitForLoadState('load');
        console.log("Page loaded.");
    } catch (error) {
        console.warn("Page did not load within timeout, continuing...");
    }
};

export const retryWithBackoff = async (
    action: () => Promise<void>,
    maxRetries = MAX_RETRIES,
    baseDelay = 1000
) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await action();
            return;
        } catch (error) {
            if (attempt === maxRetries) throw error;
            const delay = baseDelay * Math.pow(2, attempt - 1);
            console.log(error)
            console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

export const takeScreenshot = async (page: Page, prefix: string, name: string) => {
    const screenshotPath = `screenshot-${prefix}-${name}-${Date.now()}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot taken: ${screenshotPath}`);
};
