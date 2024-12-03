import { Page } from '@playwright/test';
import { HelperActions } from './helpers';

export class TwitterActions {
  private page: Page;
  private helperActions: HelperActions;

  constructor(page: Page) {
    this.page = page;
    this.helperActions = new HelperActions(this.page);
  }

  /**
   * Posts a new tweet with optional image
   * @param caption - Text content of the tweet
   * @param imageUrl - Optional URL of image to include in tweet
   * @returns Promise<void>
   * @throws Error if posting fails
   */
  async postToTwitter(caption: string, imageUrl?: string) {
    await this.page.goto("https://x.com");

      // Wait for 3 seconds before clicking post button
      await this.helperActions.wait(3);
      
      // Click the post/tweet button using the provided data-testid
      await this.page.waitForSelector('[data-testid="SideNav_NewTweet_Button"]');
      await this.page.click('[data-testid="SideNav_NewTweet_Button"]');

      await this.helperActions.wait(2);
      // Type the tweet text
      await this.page.fill('[data-testid="tweetTextarea_0"]', caption);
      await this.helperActions.wait(1);

      // Click the media button
      if (imageUrl) {
        const imageBuffer = await this.helperActions.downloadImage(imageUrl);
        await this.page.waitForSelector('[aria-label="Add photos or video"]');
        await this.page.click('[aria-label="Add photos or video"]');
        await this.helperActions.wait(2);
        await this.helperActions.uploadImage(imageBuffer);
      }
      
      await this.helperActions.wait(2);

      // Click the Post button
      await this.page.waitForSelector('[data-testid="tweetButton"]');
      await this.page.click('[data-testid="tweetButton"]');
      await this.helperActions.wait(2);
  }

  /**
   * Posts a reply to the current tweet
   * @param commentText - Text content of the reply
   * @returns Promise<void>
   * @throws Error if reply fails
   * @requires Must be called on a specific tweet
   */
  async reply(commentText: string) {
    try {
        // Click the reply area using the DraftEditor selector
        await this.page.locator('[data-testid="tweetTextarea_0"]').click();
        
        // Type the reply text
        await this.page.locator('[data-testid="tweetTextarea_0"]').fill(commentText);
        console.log('Reply text entered:', commentText);

        // Click the reply button
        await this.page.getByTestId('tweetButtonInline').click();
        console.log('Reply posted successfully');
        
        // Wait a moment to ensure the reply is posted
        await this.page.waitForTimeout(2000);
    } catch (error) {
        console.error('Failed to post reply:', error);
        throw error;
    }
}

  /**
   * Toggles the retweet status of the current tweet
   * @returns Promise<void>
   * @throws Error if toggle operation fails
   * @requires Must be called on a specific tweet
   */
  async toggleRetweet() {
    // Check if tweet is already retweeted using the first retweet button
    const isRetweeted = await this.page.getByTestId('unretweet').first().count() > 0;
    
    if (isRetweeted) {
      await this.unretweet();
    } else {
      await this.retweet();
    }
  }

  /**
   * Retweets the current tweet, optionally as a quote tweet
   * @param options - Optional configuration object
   * @param options.text - Optional text for quote tweet
   * @param options.imageUrl - Optional image URL for quote tweet
   * @returns Promise<void>
   * @throws Error if retweet operation fails
   * @requires Must be called on a specific tweet
   */
  async retweet(options?: { text?: string; imageUrl?: string }) {
    try {
      // Get the first retweet button
      await this.page.getByTestId('retweet').first().click();
      
      if (options?.text) {
        // Quote tweet
        await this.page.getByRole('menuitem', { name: 'Quote', exact: true }).click();
        await this.page.getByRole('textbox', { name: 'Post text' }).fill(options.text);
        
        if (options.imageUrl) {
          await this.page.getByLabel('Add photos or video').click();
          const imageBuffer = await this.helperActions.downloadImage(options.imageUrl);
          await this.helperActions.uploadImage(imageBuffer);
        }
        
        await this.page.getByTestId('tweetButton').click();
      } else {
        // Simple retweet
        await this.page.getByTestId('retweetConfirm').click();
      }
      
      console.log('Tweet retweeted successfully');
    } catch (error) {
      console.error('Failed to retweet:', error);
      throw error;
    }
  }

  /**
   * Removes retweet from the current tweet
   * @returns Promise<void>
   * @throws Error if unretweet operation fails
   * @requires Must be called on a specific tweet
   */
  async unretweet() {
    try {
      await this.page.getByTestId('unretweet').click();
      await this.page.getByTestId('unretweetConfirm').click();
      console.log('Tweet unretweeted successfully');
    } catch (error) {
      console.error('Failed to unretweet:', error);
      throw error;
    }
  }

  /**
   * Toggles follow status for the current profile
   * @returns Promise<void>
   * @throws Error if toggle operation fails
   * @requires Must be called on a profile or within a relevant people section
   */
  async toggleFollow() {
    try {
      // Check for either "Following" button or unfollow-related buttons
      const isFollowing = await this.page.getByRole('button').filter({
        hasText: /^(Following|Unfollow @|.*-unfollow)/
      }).count() > 0;

      console.log('Current follow status:', isFollowing ? 'Following' : 'Not following');

      if (isFollowing) {
        await this.unfollow();
      } else {
        await this.follow();
      }
    } catch (error) {
      console.error('Failed to toggle follow status:', error);
      throw error;
    }
  }

  /**
   * Follows a profile from the "Relevant people" section
   * @returns Promise<void>
   * @throws Error if follow operation fails
   * @requires Must be called within a relevant people section
   */
  async follow() {
    try {
      // Look for the follow button specifically within the "Relevant people" section
      const followButton = await this.page
        .locator('aside[aria-label="Relevant people"]')
        .getByRole('button', { name: /^Follow/ })
        .first();

      // Add a small delay before clicking
      await this.page.waitForTimeout(1000);
      
      await followButton.click();

      // Wait a moment to ensure the action completes
      await this.page.waitForTimeout(2000);
      
      console.log('Follow action completed successfully');
    } catch (error) {
      console.error('Failed to follow:', error);
      // Log more details about available buttons in the Relevant people section
      const buttons = await this.page.locator('aside[aria-label="Relevant people"] button').all();
      console.log('Available buttons in Relevant people:', await Promise.all(buttons.map(b => b.textContent())));
      throw error;
    }
  }

  /**
   * Unfollows the current profile
   * @returns Promise<void>
   * @throws Error if unfollow operation fails
   * @requires Must be called on a profile you're following
   */
  async unfollow() {
    try {
      // Try to find either type of unfollow button
      const unfollowButton = this.page.getByRole('button').filter({
        hasText: /^(Unfollow @|.*-unfollow|Following)/
      });
      await unfollowButton.first().click();

      // Wait for and click the confirmation button
      // This handles both confirmation types (menuitem and sheet)
      await Promise.race([
        this.page.getByRole('menuitem', { name: /Unfollow @/ }).click(),
        this.page.getByTestId('confirmationSheetConfirm').click()
      ]);

      console.log('Unfollow action completed successfully');
    } catch (error) {
      console.error('Failed to unfollow:', error);
      throw error;
    }
  }

  /**
   * Toggles bookmark status for the current tweet
   * @returns Promise<void>
   * @throws Error if toggle operation fails
   * @requires Must be called on a specific tweet
   */
  async toggleBookmark() {
    try {
      const isBookmarked = await this.page.getByTestId('removeBookmark').count() > 0;
      
      if (isBookmarked) {
        await this.removeBookmark();
      } else {
        await this.addBookmark();
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
      throw error;
    }
  }
  
  /**
   * Bookmarks the current tweet
   * @returns Promise<void>
   * @throws Error if bookmark operation fails
   * @requires Must be called on a specific tweet
   */
  async addBookmark() {
    try {
      await this.page.getByTestId('bookmark').first().click();
      console.log('Bookmark added successfully');
    } catch (error) {
      console.error('Failed to add bookmark:', error);
      throw error;
    }
  }
  
  /**
   * Removes bookmark from the current tweet
   * @returns Promise<void>
   * @throws Error if bookmark removal fails
   * @requires Must be called on a bookmarked tweet
   */
  async removeBookmark() {
    try {
      await this.page.getByTestId('removeBookmark').first().click();
      console.log('Bookmark removed successfully');
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      throw error;
    }
  }

  /**
   * Toggles like status for the current tweet
   * @returns Promise<void>
   * @throws Error if toggle operation fails
   * @requires Must be called on a specific tweet
   */
  async toggleLike(on: boolean = true) {
    try {
      const isLiked = await this.page.getByTestId('unlike').count() > 0;
      
      if (isLiked) {
        if (!on) {
          await this.unlike();
        }
      } else {
        if (on) {
          await this.like();
        }
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      throw error;
    }
  }
  
  /**
   * Likes the current tweet
   * @returns Promise<void>
   * @throws Error if like operation fails
   * @requires Must be called on a specific tweet
   */
  async like() {
    try {
      await this.page.getByTestId('like').first().click();
      console.log('Tweet liked successfully');
    } catch (error) {
      console.error('Failed to like tweet:', error);
      throw error;
    }
  }
  
  /**
   * Removes like from the current tweet
   * @returns Promise<void>
   * @throws Error if unlike operation fails
   * @requires Must be called on a liked tweet
   */
  async unlike() {
    try {
      await this.page.getByTestId('unlike').first().click();
      console.log('Tweet unliked successfully');
    } catch (error) {
      console.error('Failed to unlike tweet:', error);
      throw error;
    }
  }
  



  /**
   * Gets the shareable link for the current tweet
   * @returns Promise<void>
   * @throws Error if getting link fails
   * @requires Must be called on a specific tweet
   */
  async getLink() {
    await this.page.getByLabel(/\d+/).getByLabel('Share post').click();
    await this.page.getByRole('menuitem', { name: 'Copy link' }).click();
    // Get the clipboard contents
    const clipboardText = await this.page.evaluate(() => navigator.clipboard.readText());
    console.log("Copied link:", clipboardText);
  }


  /**
   * Navigates to the user's profile page
   * @returns Promise<boolean> - Returns true if navigation successful
   * @throws Error if navigation fails
   */
  async clickProfileButton() {
    try {
      // Wait for the profile button to be visible
      await this.page.waitForSelector('a[data-testid="AppTabBar_Profile_Link"]', { timeout: 5000 });
      // Click the profile button
      await this.page.click('a[data-testid="AppTabBar_Profile_Link"]');
      console.log("Profile button clicked successfully.");
      await new Promise(resolve => setTimeout(resolve, 4000));

      return true;
    } catch (error) {
      console.error("Error clicking profile button:", error);
    }
  }

}

