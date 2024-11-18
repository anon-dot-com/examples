<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://pub-dae6836ea721478b89301a8e71d52a33.r2.dev/anon/dev-images/anon_logo-system_white%403x.png">
  <source media="(prefers-color-scheme: light)" srcset="https://pub-dae6836ea721478b89301a8e71d52a33.r2.dev/anon/dev-images/anon_logo-900%403x.png">
  <img alt="Anon" src="https://pub-dae6836ea721478b89301a8e71d52a33.r2.dev/anon/dev-images/anon_logo-900%403x.png">
</picture>

# Quickstart

This project demonstrates how to quickly set up and use Anon's SDK for automating actions on LinkedIn. It includes both frontend and backend components to showcase the full integration flow.

## Features

- Generate link URLs for connecting user accounts
- Set up and use Anon's browser context
- Execute automated actions on LinkedIn (e.g., creating posts, sending messages)
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

2. Navigate to the quickstart directory:

   ```bash
   cd examples/quickstart
   ```

3. Install dependencies:

   ```bash
   yarn install
   ```

## Usage

1. Start the backend server:

   ```bash
   yarn run quickstart <YOUR API KEY HERE>
   ```

   This will start the backend and frontend servers on ports 4001 and 4002 respectively, and automatically open your default web browser to initiate the Anon Link process.

2. Follow the on-screen instructions to connect your LinkedIn account using Anon Link.

3. Once connected, the script will automatically create a post on LinkedIn using [Anon's actions library](https://github.com/anon-dot-com/actions).

For a more detailed walkthrough, you can follow the official quickstart guide at [docs.anon.com/docs/quickstart](https://docs.anon.com/docs/quickstart).

## Customization

You can customize the automated action by modifying the `RUN_ACTION` constant in `index.ts`. Some examples are provided, such as creating a post or sending a message on LinkedIn.

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
- `@anon/actions`: Pre-built actions for various platforms
- `fastify`: Fast and low overhead web framework for Node.js
- `playwright`: Browser automation library

For a full list of dependencies, see `package.json`.

## Support

For any questions or support, please contact [support@anon.com](mailto:support@anon.com).
