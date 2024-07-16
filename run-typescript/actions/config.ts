import { Page } from "playwright";
import { instagramNavigateToMessages } from "./instagram/instagramMessage";
import { amazonAddAirpodsToCart } from './amazon/amazonAddHeadphonesToCart'
// Check out other out-of-the-box actions at https://github.com/anon-dot-com/actions
import { NetworkHelper, runCreateLinkedinPost } from "@anon/actions";

export const DEFAULT_APP: AppName = "linkedin";
export const NETWORK_TIMEOUT = 10000; // 10 seconds
export const MAX_RETRIES = 5;
export const DO_DELETE_SESSION = false;

export interface AppConfig {
  url: string;
  action: (page: Page) => Promise<void>;
}

export const APP_CONFIG: { [key: string]: AppConfig } = {
  amazon: {
    url: "https://www.amazon.com",
    action: amazonAddAirpodsToCart,
  },
  instagram: {
    url: "https://www.instagram.com",
    action: instagramNavigateToMessages,
  },
  linkedin: {
    url: "https://www.linkedin.com",
    action: runCreateLinkedinPost(
      new NetworkHelper(NETWORK_TIMEOUT), 
      `I'm testing Anon.com and automatically generated this post in < 5 minutes.
      Find out more about using Anon to automate your agent automations at Anon.com.`
    ),
  },
  // Add other apps here, for example:
  // twitter: {
  //   url: "https://twitter.com",
  //   action: twitterPostTweet
  // },
};

export type AppName = keyof typeof APP_CONFIG;
