import { Page } from "@playwright/test";
import { TwitterActions } from "../integrations/twitter";
import { InstagramActions } from "../integrations/instagram";
import { OpenTableActions } from "../integrations/opentable";
import { LinkedInActions } from "../integrations/linkedin";

type SupportedApp = "linkedin" | "twitter" | "instagram" | "opentable";
type Actions =
  | LinkedInActions
  | TwitterActions
  | InstagramActions
  | OpenTableActions;

export class IntegrationManager {
  private actions: Record<string, Actions> = {};

  constructor(private page: Page, apps: string[]) {
    // Initialize requested integrations
    apps.forEach((app) => {
      if (this.isSupportedApp(app)) {
        switch (app) {
          case "linkedin":
            this.actions[app] = new LinkedInActions(page);
            break;
          case "twitter":
            this.actions[app] = new TwitterActions(page);
            break;
          case "instagram":
            this.actions[app] = new InstagramActions(page);
            break;
          case "opentable":
            this.actions[app] = new OpenTableActions(page);
            break;
        }
      }
    });
  }

  private isSupportedApp(app: string): app is SupportedApp {
    return ["linkedin", "twitter", "instagram", "opentable"].includes(app);
  }

  get linkedin() {
    return this.actions["linkedin"] as LinkedInActions;
  }
  get twitter() {
    return this.actions["twitter"] as TwitterActions;
  }
  get instagram() {
    return this.actions["instagram"] as InstagramActions;
  }
  get opentable() {
    return this.actions["opentable"] as OpenTableActions;
  }
}
