# Anon Backend SDK Typescript Example

This sample demonstrates how to use the Anon's TypeScript SDK to connect to integrations like Instagram.

## Setup

First, follow this repo's `README`.

To run this example, you'll need to verify environment variables and install dependencies.

### Environment Variables

This folder should have an `.env` symbolic link that points to the `.env` file in this repo, which you had filled in using the credentials from Anon.

You could sanity check for the environment variables with eg
```
source .env
echo $ANON_APP_USER_ID
```

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
