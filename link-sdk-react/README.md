# Anon Web Link Example - React

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
yarn add @playwright/test
npx playwright install
```

Please verify that the environment variables from `../.env` and `.env` are correctly loaded.
If they aren't loaded (check the Console for the log), you may need to hardcode them in `src/App.vue`.

Then run

```sh
npm run start
# or
yarn run start
```
