<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://pub-dae6836ea721478b89301a8e71d52a33.r2.dev/anon/dev-images/anon_logo-system_white%403x.png">
  <source media="(prefers-color-scheme: light)" srcset="https://pub-dae6836ea721478b89301a8e71d52a33.r2.dev/anon/dev-images/anon_logo-900%403x.png">
  <img alt="Anon" src="https://pub-dae6836ea721478b89301a8e71d52a33.r2.dev/anon/dev-images/anon_logo-900%403x.png">
</picture>

# Actions Demos

To get started, 

1. set your API key and user_email in the `index.ts` file
2. 
3. install the dependencies.

```sh
npm install
```

### Environment Variables

Each sample has a `.env.template` file that you should copy to a new file called `.env` in the same directory. Fill in the environment variables with the credentials Anon provided you.

At minimum, the `.env` file should have the following variables:

```
ANON_ENV=sandbox
NPM_TOKEN=...
ANON_API_KEY=...

ANON_SDKCLIENT_ID=...
ANON_APP_USER_ID_TOKEN=...
ANON_APP_USER_ID=...
```

Then, source the `.env` file.

```
source .env
```

> NOTE: `.env` files are a convenient local development tool. Never run a production application using an environment file with secrets in it.

## Testing

You can quickly test out Anon by connecting a user session (examples prefixed `connect-*`), then running a user session (examples prefixed `run-*`).

For example, run our [Web Link - React example](https://github.com/anon-dot-com/examples/tree/main/connect-react), followed by our [Backend SDK - Typescript example](https://github.com/anon-dot-com/examples/tree/main/run-typescript). You could tweak the Typescript example with your own Playwright sessions to test Anon for your use case.

To try out an example, `cd` into one of the folders and follow the instructions in the corresponding `README`. Enjoy!