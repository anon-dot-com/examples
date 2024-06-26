# Anon Web Link Example - React

This sample demonstrates how to use the Anon's linking library to connect to integrations like Instagram.

## Setup

First, follow this repo's `README`.

To run this example, you'll need to verify environment variables and install dependencies.

### Environment Variables

This folder should have an `.env` symbolic link that points to the `.env` file in this repo, which you had filled in using the credentials from Anon.

You could sanity check for the environment variables with eg
```
echo $REACT_APP_ANON_APP_USER_ID_TOKEN
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
yarn install --update-checksums
```

## Running the Example

Start your app with:

```sh
npm run start
# or
yarn run start
```

You should see a window pop up for Anon to connect to your account (eg Instagram). Click "Continue", then "Login to X" to save your user session!
