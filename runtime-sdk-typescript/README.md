# Anon Backend SDK Typescript Example

To get started, set your `ANON_NPM_TOKEN` environment variable, or copy the `.npmrc` file you may have received from Anon.

```sh
sed "s/\${ANON_NPM_TOKEN}/${ANON_NPM_TOKEN}/g" .npmrc.template >.npmrc
```

Install your dependencies with npm or yarn

```sh
npm install
# or
yarn install --update-checksums
```

Install the playwright browser binaries if you do not have them already.

```sh
npx playwright install
```

Configure your `SdkClient` API_KEY by editing static values in `index.ts`, or loading them via environment variables.

Then start your app with:

```sh
npm run dev
# or
yarn run dev
```
