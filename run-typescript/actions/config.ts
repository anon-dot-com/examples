import { Page } from "playwright";
import { linkedInCreatePost } from "./linkedin/linkedInCreatePost";
import { instagramSendMessageToSelf, instagramNavigateToMessages } from "./instagram/instagramMessage";
import { amazonAddHeadphonesToCart } from './amazon/amazonAddHeadphonesToCart'

export const DEFAULT_APP: AppName = "amazon";
export const NETWORK_TIMEOUT = 60000; // 60 seconds
export const MAX_RETRIES = 5;

export interface AppConfig {
  url: string;
  action: (page: Page) => Promise<void>;
}

export const APP_CONFIG: { [key: string]: AppConfig } = {
  amazon: {
    url: "https://www.amazon.com",
    action: amazonAddHeadphonesToCart,
  },
  instagram: {
    url: "https://www.instagram.com",
    action: instagramNavigateToMessages,
  },
  linkedin: {
    url: "https://www.linkedin.com",
    action: linkedInCreatePost,
  },
  // Add other apps here, for example:
  // twitter: {
  //   url: "https://twitter.com",
  //   action: twitterPostTweet
  // },
};

export type AppName = keyof typeof APP_CONFIG;
