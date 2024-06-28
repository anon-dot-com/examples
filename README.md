# Anon Examples

This repository accompanies Anon's setup guides at [the Anon docs](https://docs.anon.com/).

## Setup

To run these examples, you'll need credentials from Anon. You can request access [here](https://anondotcom.typeform.com/request-access).

To get started, clone the repository.

```sh
git clone https://github.com/anon-dot-com/examples.git && cd ./examples
```

### Environment Variables

Copy `.env.example` to a new file in this directory called `.env` and fill in each of the environment variables, using the credentials Anon provided you.

At minimum, the `.env` file should have the following variables:

```
ANON_ENV=sandbox
NPM_TOKEN=...

ANON_SDKCLIENT_ID=...
ANON_APP_USER_ID_TOKEN=...
ANON_APP_USER_ID=...
ANON_API_KEY=...

ANON_CHROME_EXTENSION_ID=...
```

Then, source the `.env` file.
```
source .env
```

> NOTE: `.env` files are a convenient local development tool. Never run a production application using an environment file with secrets in it.

## Testing

You could quickly test out Anon by connecting a user session (examples prefixed `connect-*`), then running a user session (examples prefixed `run-*`).

For example, run our [Web Link - React example](https://github.com/anon-dot-com/examples/tree/main/connect-react), followed by our [Backend SDK - Typescript example](https://github.com/anon-dot-com/examples/tree/main/run-typescript). You could tweak the Typescript example with your own Playwright sessions to test Anon for your use case.

To try out an example, `cd` into one of the folders and follow the instructions in the corresponding `README`. Enjoy!