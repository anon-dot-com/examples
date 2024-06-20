import AnonLink from "@anon/sdk-web-link-typescript";

function App() {
  const onSuccess = () => {
    console.log("success");
  };
  const onExit = (error: any) => {
    anonLinkInstance.destroy();
  };

  const config = {
    // Please reference ../.env.example for variable definitions
    environment: (process.env.REACT_APP_ANON_ENV as any) || "sandbox",
    clientId: process.env.REACT_APP_ANON_SDKCLIENT_ID!,
    appUserIdToken: process.env.REACT_APP_ANON_APP_USER_ID_TOKEN!,
    // Update per the app you're testing with.
    app: "instagram",
    company: process.env.REACT_APP_ANON_COMPANY_NAME!,
    companyLogo: process.env.REACT_APP_ANON_COMPANY_LOGO!,
    chromeExtensionId: process.env.REACT_APP_ANON_CHROME_EXTENSION_ID!,
  };
  console.log(config);

  // Initialize AnonLink with configuration settings.
  const anonLinkInstance = AnonLink.init({
    config,
    onSuccess, // Callback function to handle success events.
    onExit, // Callback function to handle exit or failure events.
  });

  const open = () => {
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
