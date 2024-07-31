# Anon Runtime Extension

This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with
[`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

### Fill out a `.env` file with your credentials

Start with the template:

```bash
cp .env.template .env
```

> [!TIP]
> You can find these credentials in the 1Password file that was shared during onboarding.

The value for `PLASMO_PUBLIC_CHROME_EXTENSION_ID` must be filled in after loading the chrome extension
into your browser. It can be found 

### Fill out a `.npmrc` file

Start with the template:

```bash
cp .npmrc.template .npmrc
```

If you followed the instructions in the higher level [README.md](../README.md),
the $NPM_TOKEN variable should already be set for you.
If not, you can just paste in the raw value from the 1Password file.

### Run the development server

```bash
yarn dev
```

Open your browser and load the appropriate development build. For example, if
you are developing for the chrome browser, using manifest v3, use:
`build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update
as you make changes. To add an options page, simply add a `options.tsx` file to
the root of the project, with a react component default exported. Likewise to
add a content page, add a `content.ts` file to the root of the project,
importing some module and do some logic, then reload the extension on your
browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Using the Extension

Click on the extension's icon to get started!
You should see a small window appear that shows a your User ID, and a list of app integrations.

### Linking a session

To link a new session, click the `Link` button next to whichever app you'd like to use.
The Link UI will appear and guide you through connecting your account. Once it's connected,
you can simply close the tab.

Click the `Refresh` button to see the session appear the bottom of the extension's popup UI.

### Resetting a session

If you'd like to sign-out of an app that you've linked a session for, click the `Reset` button.
This will wipe your browser's state (cookies, localStorage, etc) for the app so you can sign-in again.

### Running a session

Click the `Run` button next to one of your connected sessions at the bottom of the popup UI.
A new tab for that app authenticated as the user will appear.

### Delete a session

Click the `Delete` button to wipe session data from Anon's servers.

### Refresh

Click the `Refresh` button to see the latest session that are available for you to run.

### Disable Proxying

By default, proxying is enabled. This means that when you click `Run`, your network traffic will be
sent through Anon's proxies for that app. You can click `Disable` to turn off proxying altogether.

### Clear Proxying

Sometimes, proxies can fail and your browser may no long load sites properly. Click `Clear Proxy` to remove
any proxy configuration that the extension has configured.

## Advanced

### Making production build

Run the following:

```bash
yarn build
```

This should create a production bundle for your extension, ready to be zipped
and published to the stores.

### Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in
[bpp](https://bpp.browser.market) GitHub action. Prior to using this action
however, make sure to build your extension and upload the first version to the
store to establish the basic credentials. Then, simply follow
[this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and
you should be on your way for automated submission!

> [!TIP] 
> Make sure to match the `manifest` set in the `package.json` file.
> `permissions`, `externally_connectable`, and `host_permissions` must
> be set properly for the SDK to work.
