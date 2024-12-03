import { Page } from '@playwright/test';
import { HelperActions } from '../integrations/helpers';


/* Post-specific functions:
    all functions below must be performed on the url of the post, not on the feed page
*/ 

/* enumerate reaction types and make sure this doens't break with bad inputs */
export type LinkedInReactionType = 'like' | 'celebrate' | 'support' | 'funny' | 'love' | 'insightful' | 'curious';

export class LinkedInActions {
    private page: Page;
    private helperActions: HelperActions;

    constructor(page: Page) {
        this.page = page;
        this.helperActions = new HelperActions(page);
    }

    /**
     * Posts content to LinkedIn with optional image
     * @param caption - Text content of the post
     * @param imageUrl - Optional URL of image to include in post
     * @returns Promise<void>
     * @throws Error if any step of posting process fails
     */
    async postToLinkedIn(caption: string, imageUrl?: string) {
        await this.page.goto("https://linkedin.com");
        
        // Wait for and click the "Start a post" button
        await this.page.waitForSelector('#ember30.artdeco-button--tertiary');
        await this.page.click('#ember30.artdeco-button--tertiary');
        await this.helperActions.wait(2);
      
        // Find and fill in the caption text area
        await this.page.waitForSelector('div[data-test-ql-editor-contenteditable="true"]');
        await this.page.type('div[data-test-ql-editor-contenteditable="true"]', caption);
        await this.helperActions.wait(2);
      

        if (imageUrl) {
            const imageBuffer = await this.helperActions.downloadImage(imageUrl);
            await this.helperActions.uploadImage(imageBuffer);
            // Wait for and click the media upload button
            await this.page.waitForSelector('button[aria-label="Add media"]');
            await this.page.click('button[aria-label="Add media"]');
            await this.helperActions.wait(2);
        }

        // Click the Next button
        await this.page.waitForSelector('button[aria-label="Next"].artdeco-button--primary');
        await this.page.click('button[aria-label="Next"].artdeco-button--primary');
        await this.helperActions.wait(2);
      
        // Click the "Post" button
        await this.page.waitForSelector('button.share-actions__primary-action.artdeco-button--primary');
        await this.page.click('button.share-actions__primary-action.artdeco-button--primary');
        await this.helperActions.wait(2);
      
      }

    /**
     * Reacts to a LinkedIn post with specified reaction type
     * @param reaction - Type of reaction ('like', 'celebrate', 'support', 'funny', 'love', 'insightful', 'curious')
     * @returns Promise<void>
     * @throws Error if reaction fails
     * @requires Must be called on a specific post URL
     */
    async react(reaction: LinkedInReactionType) {
        await this.page.evaluate((reactionType) => {
            // Find all reaction buttons
            const buttons = Array.from(document.querySelectorAll('button.reactions-menu__reaction-index'));
            
            // Find the button with matching reaction description
            const targetButton = buttons.find(button => {
                const description = button.querySelector('.reactions-menu__reaction-description');
                return description?.textContent?.toLowerCase() === reactionType.toLowerCase();
            });

            // Click the button if found
            if (targetButton) {
                (targetButton as HTMLElement).click();
            } else {
                throw new Error(`Reaction button for "${reactionType}" not found`);
            }
        }, reaction);
    }

    /**
     * Comments on a LinkedIn post
     * @param comment - Text content of the comment
     * @returns Promise<void>
     * @throws Error if comment submission fails
     * @requires Must be called on a specific post URL
     */
    async comment(comment: string) {
        await this.page.getByLabel('Comment', { exact: true }).click();
        await this.page.getByLabel('Text editor for creating').fill(comment);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.page.locator('button.comments-comment-box__submit-button--cr').click();
    }

    /**
     * Sends the current post as a direct message to a specified user
     * @param name - Name of the user to send the message to
     * @returns Promise<void>
     * @throws Error if message sending fails
     * @requires Must be called on a specific post URL
     */
    async sendAsDM(name: string) {
        await this.page.getByLabel('Send in a private message').click();
        await this.page.getByPlaceholder('Type a name').fill(name);
        await this.page.getByRole('button', { name: name }).click();
        await this.page.getByRole('button', { name: 'Send' }).click();
    }

    /**
     * Reposts a LinkedIn post with optional custom message
     * @param instant - If true, reposts immediately; if false, allows adding thoughts
     * @param thoughts - Optional custom message to add when reposting (used only if instant is false)
     * @returns Promise<void>
     * @throws Error if repost operation fails
     * @requires Must be called on a specific post URL
     */
    async repostPost(instant: boolean = true, thoughts: string = "") {
        await this.page.getByRole('button', { name: 'Repost', exact: true }).click();
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (instant) {
            await this.page.getByRole('button', { name: 'Repost Instantly' }).click();
        } else {
            await this.page.getByRole('button', { name: 'Repost with your thoughts' }).click();
            await this.page.getByRole('textbox', { name: 'Text editor for creating' }).fill(thoughts);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await this.page.getByRole('button', { name: 'Post', exact: true }).click();
        }
    }

    /**
     * Removes a reaction from a LinkedIn post
     * @param reaction - Type of reaction to remove (defaults to "like")
     * @returns Promise<void>
     * @throws Error if unreact operation fails
     * @requires Must be called on a specific post URL
     */
    async unreact(reaction: string = "like") {
        await this.page.getByRole('button', { name: 'React Like', exact: true }).first().hover();
        await this.page.getByRole('button', { name: `React Like` }).click();
        await this.page.getByLabel(`Unreact Like`).click();
    }
}

