import { Page } from '@playwright/test';
import { HelperActions } from '../manager/helpers';

export class InstagramActions {
  private page: Page;
  private helperActions: HelperActions;

  constructor(page: Page) {
    this.page = page;
    this.helperActions = new HelperActions(this.page);
  }


  /** Posts an image to Instagram with an optional caption */
  async post(page: Page, imageUrl: string, caption?: string) {
    await page.goto("https://instagram.com");

    // Download image
    const imageBuffer = await this.helperActions.downloadImage(imageUrl);

    // Wait for the create button to be visible and click it
    await page.waitForSelector('svg[aria-label="New post"]');
    await page.click('svg[aria-label="New post"]');
    
    // Wait for the Post button to appear and click it
    await page.waitForSelector('svg[aria-label="Post"]');
    await page.click('svg[aria-label="Post"]');
    await page.waitForTimeout(2000);
  
    // Click upload image
    await page.waitForSelector('button:has-text("Select from computer")');
    await page.click('button:has-text("Select from computer")');
    await page.waitForTimeout(2000);
  
  
    // Handle file upload using the downloaded image
    await this.helperActions.uploadImage(imageBuffer);
  
    // Click the Next button twice
    await page.waitForSelector('div[role="button"]:has-text("Next")');
    await page.click('div[role="button"]:has-text("Next")');
    await page.waitForTimeout(1000);
    await page.waitForSelector('div[role="button"]:has-text("Next")');
    await page.click('div[role="button"]:has-text("Next")');
    await page.waitForTimeout(2000);
  
    // Write a caption
    await page.fill('div[aria-label="Write a caption..."]', caption ?? "");
  
    // Click the Share button
    await page.waitForSelector('div[role="button"]:has-text("Share")');
    await page.click('div[role="button"]:has-text("Share")');
    await page.waitForTimeout(2000);
  }




  /**
   * Toggles the like status of the current post
   * @param shouldLike - Boolean indicating desired like state (true to like, false to unlike)
   */
  async toggleLike(shouldLike: boolean = true) {
    try {
      const isLiked = await this.page.evaluate(() => {
        // Find all SVGs with aria-label "Unlike"
        const unlikeSvgs = Array.from(document.querySelectorAll('svg[aria-label="Unlike"]'));
        // Get the largest one (main post button is typically 24x24)
        const mainUnlikeButton = unlikeSvgs
          .filter(svg => svg.getAttribute('width') === '24')
          .filter(svg => svg.getAttribute('height') === '24')[0];
        return mainUnlikeButton !== undefined;
      });
      
      if (isLiked !== shouldLike) {
        await (shouldLike ? this.like() : this.unlike());
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      throw error;
    }
  }

  /**
   * Likes the current post
   */
  async like() {
    try {
      await this.page.evaluate(() => {
        // Find all SVGs with aria-label "Like"
        const likeSvgs = Array.from(document.querySelectorAll('svg[aria-label="Like"]'));
        // Filter for the largest ones (24x24)
        const mainLikeButton = likeSvgs
          .filter(svg => svg.getAttribute('width') === '24')
          .filter(svg => svg.getAttribute('height') === '24')[0]
          ?.closest('div[role="button"]') as HTMLElement;
        
        if (mainLikeButton) {
          mainLikeButton.click();
        } else {
          throw new Error('Main post Like button not found');
        }
      });

      // Verify the action worked
      await this.page.waitForTimeout(1000);
      const success = await this.page.evaluate(() => {
        const unlikeSvgs = Array.from(document.querySelectorAll('svg[aria-label="Unlike"]'));
        return unlikeSvgs.some(svg => 
          svg.getAttribute('width') === '24' && 
          svg.getAttribute('height') === '24'
        );
      });
      
      if (!success) {
        throw new Error('Like action failed to register');
      }
      
      console.log('Post liked successfully');
    } catch (error) {
      console.error('Failed to like post:', error);
      throw error;
    }
  }

  /**
   * Unlikes the current post
   */
  async unlike() {
    try {
      await this.page.evaluate(() => {
        // Find all SVGs with aria-label "Unlike"
        const unlikeSvgs = Array.from(document.querySelectorAll('svg[aria-label="Unlike"]'));
        // Filter for the largest ones (24x24)
        const mainUnlikeButton = unlikeSvgs
          .filter(svg => svg.getAttribute('width') === '24')
          .filter(svg => svg.getAttribute('height') === '24')[0]
          ?.closest('div[role="button"]') as HTMLElement;
        
        if (mainUnlikeButton) {
          mainUnlikeButton.click();
        } else {
          throw new Error('Main post Unlike button not found');
        }
      });

      // Verify the action worked
      await this.page.waitForTimeout(1000);
      const success = await this.page.evaluate(() => {
        const likeSvgs = Array.from(document.querySelectorAll('svg[aria-label="Like"]'));
        return likeSvgs.some(svg => 
          svg.getAttribute('width') === '24' && 
          svg.getAttribute('height') === '24'
        );
      });
      
      if (!success) {
        throw new Error('Unlike action failed to register');
      }
      
      console.log('Post unliked successfully');
    } catch (error) {
      console.error('Failed to unlike post:', error);
      throw error;
    }
  }

  
  /**
   * Posts a comment on the current post
   * @param commentText - Text to be posted as comment
   */
  async comment(commentText: string) {
    try {
      // Wait for the comment section to be visible and ready
      await this.page.waitForSelector('textarea[aria-label="Add a comment…"]', { state: 'visible', timeout: 5000 });
      
      // Click directly on the textarea using a more specific selector
      await this.page.locator('textarea[aria-label="Add a comment…"]').first().click();
      
      // Small delay to ensure the input is ready
      await this.page.waitForTimeout(500);
      
      // Fill and submit
      await this.page.getByPlaceholder('Add a comment…').fill(commentText);
      await this.page.getByRole('button', { name: 'Post' }).click();
      
      console.log('Comment posted successfully');
    } catch (error) {
      console.error('Failed to post comment:', error);
      throw error;
    }
  }

  /* 
  Save/Bookmark functions 
  */
  /**
   * Toggles the save/bookmark status of the current post
   * @param shouldSave - Boolean indicating desired save state (true to save, false to unsave)
   */
  async toggleSave(shouldSave: boolean = true) {
    try {
      const isSaved = await this.page.locator('svg[aria-label="Remove"]').count() > 0;
      
      if (isSaved !== shouldSave) {
        await (shouldSave ? this.save() : this.unsave());
      }
    } catch (error) {
      console.error('Failed to toggle save:', error);
      throw error;
    }
  }

  /**
   * Saves/bookmarks the current post
   */
  async save() {
    try {
      await this.page.locator('svg[aria-label="Save"]').click();
      console.log('Post saved successfully');
    } catch (error) {
      console.error('Failed to save post:', error);
      throw error;
    }
  }

  /**
   * Removes the save/bookmark from the current post
   */
  async unsave() {
    try {
      await this.page.locator('svg[aria-label="Remove"]').click();
      console.log('Post unsaved successfully');
    } catch (error) {
      console.error('Failed to unsave post:', error);
      throw error;
    }
  }

  /**
   * Shares the current post with specified user
   * @param username - Username to share the post with
   */
  async share(username: string) {
    try {
      // Click share button
      await this.page.locator('svg[aria-label="Share"]').click();
      
      // Type username in search
      await this.page.getByPlaceholder('Search').click();
      await this.page.getByPlaceholder('Search').fill(username);
      
      // Wait a bit for search results and click first result
      await this.page.waitForTimeout(1000);
      
      // Target the checkbox input specifically
      await this.page.locator('input[name="ContactSearchResultCheckbox"]').first().click();
      
      // Click send
      await this.page.getByRole('button', { name: 'Send' }).click();
      console.log('Post shared successfully');
    } catch (error) {
      console.error('Failed to share post:', error);
      throw error;
    }
  }


  /**
   * Toggles the follow status for the current profile
   * @param shouldFollow - Boolean indicating desired follow state (true to follow, false to unfollow)
   */
  async toggleFollow(shouldFollow: boolean = true) {
    try {
      const hasFollowButton = await this.page.getByRole('button', { name: 'Follow' }).count() > 0;
      const hasFollowingButton = await this.page.getByRole('button', { name: 'Following' }).count() > 0;
      
      if (!hasFollowButton && !hasFollowingButton) {
        console.log('No follow/following button found - skipping follow action');
        return;
      }

      const isFollowing = hasFollowingButton;
      if (isFollowing !== shouldFollow) {
        await (shouldFollow ? this.follow() : this.unfollow());
      }
    } catch (error) {
      console.log('Failed to toggle follow - skipping action:', error);
    }
  }

  /**
   * Follows the current profile
   */
  async follow() {
    try {
      const followButton = this.page.getByRole('button', { name: 'Follow' });
      if (await followButton.count() > 0) {
        await followButton.click();
        console.log('User followed successfully');
      } else {
        console.log('Follow button not found - skipping action');
      }
    } catch (error) {
      console.log('Failed to follow user - skipping action:', error);
    }
  }

  /**
   * Unfollows the current profile
   */
  async unfollow() {
    try {
      const followingButton = this.page.getByRole('button', { name: 'Following' });
      if (await followingButton.count() > 0) {
        await followingButton.click();
        await this.page.getByRole('button', { name: 'Unfollow' }).click();
        console.log('User unfollowed successfully');
      } else {
        console.log('Following button not found - skipping action');
      }
    } catch (error) {
      console.log('Failed to unfollow user - skipping action:', error);
    }
  }
} 