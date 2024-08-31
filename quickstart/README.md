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
- Simple backend server using Fastify
- Frontend demo for initiating the Anon Link process

## Prerequisites

- Node.js
- Yarn package manager
- An Anon API Key (obtainable from [console.anon.com](https://console.anon.com))

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

4. Set up your API Key:
   Open `index.ts` and replace `"YOUR API KEY HERE"` with your actual Anon API Key.

## Usage

1. Start the backend server:

   ```bash
   yarn start
   ```

   This will start the Fastify server on port 4001 and automatically open your default web browser to initiate the Anon Link process.

2. Follow the on-screen instructions to connect your LinkedIn account using Anon Link.

3. Once connected, the script will automatically execute the chosen action (e.g., creating a post on LinkedIn).

For a more detailed walkthrough, you can follow the official quickstart guide at [docs.anon.com/docs/quickstart](https://docs.anon.com/docs/quickstart).

## Customization

You can customize the automated action by modifying the `RUN_ACTION` constant in `index.ts`. Some examples are provided, such as creating a post or sending a message.

## Project Structure

- `index.ts`: Main entry point, contains both backend and frontend logic
- `decode-jwt.ts`: Utility functions for working with JWTs
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration

## Dependencies

This project uses several key dependencies:

- `@anon/sdk-typescript`: Anon's SDK for TypeScript
- `@anon/actions`: Pre-built actions for various platforms
- `fastify`: Fast and low overhead web framework for Node.js
- `playwright`: Browser automation library

For a full list of dependencies, see `package.json`.

## License

This project is licensed under the MIT License.

## Support

For any questions or support, please contact [support@anon.com](mailto:support@anon.com).

---

**Note**: This project is part of Anon's private beta. To request access, visit [https://anondotcom.typeform.com/request-access](https://anondotcom.typeform.com/request-access?typeform-source=docs.anon.com).