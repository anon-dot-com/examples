# Anon iOS SDK React Native Example

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

0. Using your credentials provided by Anon, go to `app/(tabs)/index.tsx` and fill in the values `clientId` and `appUserIdToken`.

1. Set your `NPM_TOKEN` environment variable, or copy the `.npmrc` file you may have received from Anon.

```sh
source .env
sed "s/\${NPM_TOKEN}/${NPM_TOKEN}/g" .npmrc.template >.npmrc
```

2. Install dependencies

```bash
yarn install
```

3. Start the app (on a device or in a simulator)

```bash
npx expo run:ios -d
```
