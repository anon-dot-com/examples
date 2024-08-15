# Anon Backend SDK Typescript Example

This sample demonstrates how to use the Anon's TypeScript SDK to connect to integrations like Instagram.

## Setup

First, follow this repo's `README`.

To run this example, you'll need to verify environment variables and install dependencies.

### Environment Variables

This sample has a `.env.template` file that you should copy to a new file called `.env` in the same directory. Fill in the environment variables with the credentials Anon provided you.

Then source the `.env` file.

```sh
source .env
```

## Install Dependencies

Install your dependencies with npm or yarn:

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
