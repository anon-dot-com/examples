# Anon Examples

This repository accompanies Anon's setup guides at [the Anon docs](https://docs.anon.com/)

To get started, clone the repository, `cd` into one of the folders,
and follow the instructions in the corresponding `README`. Enjoy!

```sh
git clone https://github.com/anon-dot-com/examples.git && cd ./examples
```

## Setting up environment variables

```bash
cp .env.example .env
source .env
```

Copy `.env.example` to a new file called `.env` and fill out the environment variables inside.
Get your environment variables from the 1password link Anon provided you.

> NOTE: `.env` files are a convenient local development tool. Never run a production application
> using an environment file with secrets in it.
>
