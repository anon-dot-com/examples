import AnonLink from "@anon/sdk-web-link-typescript";
import { getSdkClientIdFromIdToken } from "./decode-jwt";
import { readFileSync } from "node:fs";

function App() {
  // TODO loading spinner
  const open = async () => {
    const API_KEY = readFileSync("../../API_KEY", 'utf8').trim();
    const APP_USER_ID = "quickstart-user";

    if (API_KEY == "YOUR API KEY HERE") {
      throw new Error("Paste your API key into the API_KEY file");
    }

    const environment = "sandbox" as const;

    // Get appUserIdToken + clientId // TODO remove clientId
    // TODO use SDK
    const appUserIdToken = (await (await fetch(`https://svc.${environment}.anon.com/org/appUserIdToken`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        appUserId: APP_USER_ID
      })
    })).json()).appUserIdToken as string;
    const clientId = getSdkClientIdFromIdToken(appUserIdToken);

    const config = {
      environment,
      clientId,
      appUserIdToken,
      // Update per the app you're testing with.
      app: "linkedin",
      company: "Anon Quickstart App",
      companyLogo: "", // TODO
      chromeExtensionId: "", // TODO
    };

    // Initialize AnonLink with configuration settings.
    const anonLinkInstance = AnonLink.init({
      config,
      // Callback function to handle success events.
      onSuccess: () => console.log("success"),
      // Callback function to handle exit or failure events.
      onExit: (error: any) => anonLinkInstance.destroy(),
    });

    anonLinkInstance.open();
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={open}>Open Anon Link</button>
      </header>
    </div>
  );
}

export default App;
