import { Page } from "playwright";
import { linkedInCreatePost } from "./linkedin/linkedInCreatePost";

export interface AppConfig {
  url: string;
  action: (page: Page) => Promise<void>;
}

export const APP_CONFIG: { [key: string]: AppConfig } = {
  linkedin: {
    url: "https://www.linkedin.com",
    action: linkedInCreatePost
  },
  // Add other apps here, for example:
  // twitter: {
  //   url: "https://twitter.com",
  //   action: twitterPostTweet
  // },
};

export type AppName = keyof typeof APP_CONFIG;

export const DEFAULT_APP: AppName = "linkedin";
export const NETWORK_TIMEOUT = 60000; // 60 seconds
export const MAX_RETRIES = 5;
