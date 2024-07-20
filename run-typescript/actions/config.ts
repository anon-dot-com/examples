export const NETWORK_TIMEOUT_MS = 5000; // 5 seconds
export const MAX_RETRIES = 5;
export const DO_DELETE_SESSION = false;

export const APP_URLS: { [key: string]: string } = {
  amazon: "https://www.amazon.com",
  instagram: "https://www.instagram.com",
  linkedin: "https://www.linkedin.com",
};

export type AppName = 'amazon' | 'instagram' | 'linkedin';
