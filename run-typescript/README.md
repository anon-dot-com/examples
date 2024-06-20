# Anon Backend SDK Typescript Example

This sample demonstrates how to use the Anon's TypeScript SDK to connect to services like Instagram.

## Setup

Copy the repo's `.env.example` file into `.env` and fill in the necessary values.

### Environment Variables

Environment variables needed:

```
ANON_ENV=sandbox
ANON_APP_USER_ID=
ANON_API_KEY=
NPM_TOKEN=
```

### NPM Token

Set your `NPM_TOKEN` environment variable in the file `.npmrc`:

```sh
sed "s/\${NPM_TOKEN}/${NPM_TOKEN}/g" .npmrc.template >.npmrc
```

Alternatively, copy the `.npmrc` file you may have received from Anon.

## Running the example

Install your dependencies with npm or yarn, which uses the above mentioned `NPM_TOKEN`:

```sh
# If you're using npm
npm install
# or
yarn install --update-checksums
# the --update-checksums is necessary to
# support patched packages in the SDK.
# this will be removed in future versions!
```

Install the playwright browser binaries:

```sh
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
