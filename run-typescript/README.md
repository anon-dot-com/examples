# Anon Backend SDK Typescript Example

This sample demonstrates how to use the Anon's TypeScript SDK to connect to services like Instagram.

## Setup

To run this example, you'll need to set up environment variables and install dependencies.

### Environment Variables

Copy the repo's `.env.example` file into `.env` and fill in the necessary values given credentials from Anon.

At minimum, the `.env` file should have the following variables:

```
ANON_ENV=sandbox
ANON_APP_USER_ID=...
ANON_API_KEY=...
NPM_TOKEN=...
```

### NPM Token

Set your `NPM_TOKEN` environment variable in the file `.npmrc` using this command:

```sh
sed "s/\${NPM_TOKEN}/${NPM_TOKEN}/g" .npmrc.template >.npmrc
```

Alternatively, copy the `.npmrc` file you received from Anon.

## Install Dependencies

Install your dependencies with npm or yarn, which uses the above mentioned `NPM_TOKEN`:

```sh
npm install
# or
yarn
```

## Running the Example

Start your app with:

```sh
npm run dev
# or
yarn run dev
```

You should see a Playwright browser open and navigate to Instagram using Anon's browser context. From there, you can interact with Instagram as if you were this user.

Other examples in this folder demonstrate how to use the Anon SDK to interact with other services like Amazon and LinkedIn.
