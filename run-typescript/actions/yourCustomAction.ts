/**
 * @file index.ts
 * 
 * Welcome to the Anon SDK TypeScript example! This script demonstrates how to use the Anon actions SDK to interact with various services.
 * 
 * ## Why Write Your Own Actions?
 * 
 * The @anon/actions SDK provides a powerful and flexible way to automate interactions with different web services. While
 * the SDK comes with a variety of pre-built actions, the true power lies in its extensibility. By writing your own 
 * actions, you can tailor the SDK to meet your specific needs and workflows.
 * 
 * ### How to Contribute:
 * 
 * We encourage you to contribute your custom actions back to the community. By doing so, you help others who might have similar needs and foster a collaborative environment.
 * 
 * 1. **Fork the Repository**: Start by forking the [Anon Actions repository](https://github.com/anon-dot-com/actions).
 * 2. **Create Your Action**: Develop your custom action in your forked repository.
 * 3. **Submit a Pull Request**: Once your action is ready, submit a pull request to the main repository. You can do this [here](https://github.com/anon-dot-com/actions/pulls).
 * 
 * We look forward to seeing your contributions and helping to grow the Anon SDK community!
 */

import { LinkedIn, NetworkHelper } from "@anon/actions";
import { Page } from "playwright";


export const sendMessageToConnections = (networkHelper: NetworkHelper, messageText: string, n: number) => async (page: Page) => {
    await networkHelper.waitForPageLoad(page);
    await networkHelper.waitForNetworkIdle(page)
    // Get all connections
    const connections = await LinkedIn.getConnections(networkHelper)(page);
  
    for (const connection of connections.slice(0, n)) {
      try {
  
        // Navigate to the engineer's profile
        await page.goto(connection.profileUrl)
        await networkHelper.waitForPageLoad(page);
  
        // Send the message
        await LinkedIn.sendMessageOnProfilePage(networkHelper, messageText, page);
  
        console.log(`Message sent to ${connection.name}`);
      } catch (error) {
        console.error(`Failed to send message to ${connection.name}:`, error);
      }
  
      // Add a delay between messages to avoid rate limiting
      await page.waitForTimeout(5000); // 5 second delay
    }
  }