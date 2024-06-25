# Anon Examples

This repository accompanies Anon's setup guides at [the Anon docs](https://docs.anon.com/).

To get started, clone the repository, `cd` into one of the folders,
and follow the instructions in the corresponding `README`. Enjoy!

```sh
git clone https://github.com/anon-dot-com/examples.git && cd ./examples
```

## Setup

To run these examples, you'll need credentials from Anon. You can request access [here](https://anondotcom.typeform.com/request-access).

### Environment Variables

Copy `.env.example` to a new file called `.env` and fill in each of the environment variables.
Get your environment variables from the credentials Anon provided you.

At minimum, the `.env` file should have the following variables:

```
ANON_ENV=sandbox
NPM_TOKEN=...

ANON_SDKCLIENT_ID=...
ANON_APP_USER_ID_TOKEN=...
ANON_APP_USER_ID=...
ANON_API_KEY=...
```

> NOTE: `.env` files are a convenient local development tool. Never run a production application using an environment file with secrets in it.

## Testing

You could quickly test by connecting a user session, then running a user session, using our examples.

For example, run our [Web Link - React example](https://github.com/anon-dot-com/examples/tree/main/connect-react), followed by our [Backend SDK - Typescript example](https://github.com/anon-dot-com/examples/tree/main/run-typescript). You could tweak the Typescript example with your own Playwright sessions to test Anon for your use case.
