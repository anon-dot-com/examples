<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://pub-dae6836ea721478b89301a8e71d52a33.r2.dev/anon/dev-images/anon_logo-system_white%403x.png">
  <source media="(prefers-color-scheme: light)" srcset="https://pub-dae6836ea721478b89301a8e71d52a33.r2.dev/anon/dev-images/anon_logo-900%403x.png">
  <img alt="Anon" src="https://pub-dae6836ea721478b89301a8e71d52a33.r2.dev/anon/dev-images/anon_logo-900%403x.png">
</picture>

# Making a custom integration

This project is a version of the quickstart (see the `quickstart` directory in
this repo) that demonstrates how to make and use a custom integration.

## Features

- Generate link URLs for connecting user accounts
- Set up and use Anon's browser context
- Simple backend and frontend servers using Fastify
- Frontend demo for initiating the Anon Link process

## Prerequisites

- Node.js
- Yarn package manager
- An Anon API key (obtainable from [console.anon.com](https://console.anon.com))

## Installation

1. Clone the examples repository:

   ```bash
   git clone https://github.com/anon-dot-com/examples.git
   ```

2. Navigate to the `custom-integration` directory:

   ```bash
   cd examples/custom-integration
   ```

3. Install dependencies:

   ```bash
   yarn install
   ```

## Usage

1. Start the backend server:

   ```bash
   yarn run dev <YOUR API KEY HERE>
   ```

   This will start the backend and frontend servers on ports 4001 and 4002 respectively, and automatically open your default web browser to initiate the Anon Link process.

2. Follow the on-screen instructions to connect your Crunchbase account using Anon Link.

3. Once connected, the script will open a remote browser session using your connected account.

## Customization

You can customize the automated action by modifying the `RUN_ACTION` constant in `index.ts`.

You can set the ports used by the backend and frontend servers via environment variables:

- `BACKEND_PORT`: The port used by the backend server (default: 4001)
- `FRONTEND_PORT`: The port used by the frontend server (default: 4002)

## Project Structure

- `index.ts`: Main entry point, contains both backend and frontend logic
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `.npmrc`: NPM configuration for accessing Anon's private packages

## Dependencies

This project uses several key dependencies:

- `@anon/sdk-typescript`: Anon's SDK for TypeScript
- `fastify`: Fast and low overhead web framework for Node.js
- `playwright`: Browser automation library

For a full list of dependencies, see `package.json`.

## License

This project is licensed under the MIT License.

## Support

For any questions or support, please contact [support@anon.com](mailto:support@anon.com).
