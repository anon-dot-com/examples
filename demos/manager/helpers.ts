import { Page } from "@playwright/test";

export class HelperActions {
  constructor(private page: Page) {}

  // write a function to wait X seconds, with a default of 2 seconds
  async wait(seconds: number = 2): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }

  /**
   * Downloads an image from a given URL
   * @param url - The URL of the image to download
   * @returns Promise<Buffer> - The downloaded image as a buffer
   */
  async downloadImage(url: string): Promise<Buffer> {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  }

  /**
   * Uploads an image to a file input element on the page
   * @param imageUrl - The URL of the image to upload
   * @returns Promise<void>
   */
  async uploadImage(imageBuffer: Buffer): Promise<void> {
    const fileInput = await this.page.$('input[type="file"]');
    console.log("image to be uploaded: ", imageBuffer);
    if (fileInput) {
      await fileInput.setInputFiles({
        name: `image-${Date.now()}.jpg`,
        mimeType: "image/jpeg",
        buffer: imageBuffer,
      });
    } else {
      throw new Error("File input element not found");
    }
  }
}
