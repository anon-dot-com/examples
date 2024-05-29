# Anon Web Link Example - Vue

To get started, set your `NPM_TOKEN` environment variable, or copy the `.npmrc` file you may have received from Anon.

```sh
export NPM_TOKEN=YOUR_NPM_TOKEN
```

Install your dependencies with npm or yarn

```sh
npm install
# or
yarn install --update-checksums
# the --update-checksums is necessary to
# support patched packages in the SDK.
# this will be removed in future versions!
```

Set your config by editing static values in `src/App.vue`, or loading them via environment variables.

- UserPool SdkClient ID: `config.clientId` or `VITE_CLIENT_ID`
- A JWT from one of your users: `config.appUserIdToken` or `VITE_APP_USER_ID_TOKEN`

> Optionally set the Chrome extension id to your extension's id if you are embedding
> the `@anon/sdk-browser-extension` into your own.

Please verify that the environment variables are correctly loaded.
If they aren't loaded (check the Console for the log), you may need to hardcode them in `src/App.vue`

Run the app and follow the instructions to upload one of your sessions!

```sh
npm run dev
# or
yarn run dev
```
