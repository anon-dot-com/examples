# Anon Backend SDK Typescript Example

To get started, set your `ANON_NPM_TOKEN` environment variable, or copy the `.npmrc` file you may have received from Anon.

```sh
sed "s/\${ANON_NPM_TOKEN}/${ANON_NPM_TOKEN}/g" .npmrc.template >.npmrc
```

Install your dependencies with npm or yarn

```sh
# If you're using npm
npm install
npx playwright install

# If you're using yarn
yarn install --update-checksums
yarn add @playwright/test
```

Configure your `SdkClient` API_KEY by editing static values in `index.ts`, or loading them via environment variables.

Then start your app with:

```sh
npm run dev
# or
yarn run dev
```
