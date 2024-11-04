import { exec } from "child_process";
import type { Page } from "playwright";
import Fastify from "fastify";

import { AnonRuntime } from "@anon/sdk-typescript";
const API_KEY: string = process.argv[2];
const ENVIRONMENT = "local";

if (!API_KEY) {
  console.error(`
    Usage: yarn run quickstart <API_KEY>

    Please provide your Anon API Key as a command-line argument.
    Get your API Key at https://console.anon.com
  `);
  process.exit(1);
}

// Pick which app you'd like to link
const APP: string = "linkedin";
const INITIAL_URL: string = "https://linkedin.com";
const APP_USER_ID: string = "quickstart-user";

// Additional configuration
const BACKEND_PORT: number = parseInt(process.env.BACKEND_PORT ?? "4001");
const FRONTEND_PORT: number = parseInt(process.env.FRONTEND_PORT ?? "4002");

// Choose your the action you want to run based on the app selected
// Check out other out-of-the-box actions at https://github.com/anon-dot-com/actions
import { LinkedIn, NetworkHelper } from "@anon/actions";
const RUN_ACTION = LinkedIn.createPost(
  new NetworkHelper(5000 /* 5 seconds */),
  `I'm testing Anon.com and automatically generated this post in < 5 minutes.
  Find out more about using Anon to automate your agent actions at Anon.com.`,
);
// const RUN_ACTION = LinkedIn.sendMessage(
//   new NetworkHelper(5000 /* 5 seconds */),
//   <YOUR CONNECTION'S NAME>,
//   `I'm testing Anon.com and automatically send this message in < 5 minutes.
//   Find out more about using Anon to automate your agent actions at Anon.com.`
// );
// const RUN_ACTION = async (page: Page) => {
//   // perform any actions you'd like!
//   await page.waitForTimeout(5000);
//   // await page.goto("https://myactivity.google.com");
//   await page.waitForTimeout(5000);
// };

// Start your frontend server that launches Anon Link
const frontend = async () => {
  const fastify = Fastify();

  // Declare a route to start the Anon Link flow
  fastify.get("/link", async (req, reply) => {
    console.log(
      "[frontend]: Getting an Anon Link URL from your backend server",
    );
    const res = await fetch(`http://localhost:${BACKEND_PORT}/linkUrl`);
    const { linkUrl, ...error } = (await res.json()) as { linkUrl: string };

    if (!linkUrl) {
      console.error(
        `[frontend]: Failed to get Anon Link URL. Please check your API Key. \n${JSON.stringify(
          error,
        )}\n`,
      );
      reply.code(500).send("Failed to get Anon Link URL");
      process.exit(1);
    }

    console.log(
      `[frontend]: Opening Anon Link in your default browser \n${linkUrl}\n`,
    );
    const openBrowser = (url: string) => {
      let command: string;
      switch (process.platform) {
        case "darwin": // macOS
          command = `open "${url}"`;
          break;
        case "win32": // Windows
          command = `start "${url}"`;
          break;
        case "linux": // Linux
          command = `xdg-open "${url}"`;
          break;
        default:
          throw new Error("Unsupported operating system: " + process.platform);
      }
      exec(command);
    };

    openBrowser(linkUrl);
  });

  // Declare a route for the redirect url
  fastify.get("/redirect", async (req, reply) => {
    console.log(
      `[frontend]: Handling redirect from Anon Link with query params: ${JSON.stringify(
        req.query,
      )}`,
    );

    const { liveStreamingUrl } = await fetch(`http://localhost:${BACKEND_PORT}/action`).then((r) => r.json()) as { liveStreamingUrl: string };

    // TODO show the action liveStreamingUrl
    reply.type("text/html").send(
      `<html>
        <body>
          <img alt="Anon" src="https://pub-dae6836ea721478b89301a8e71d52a33.r2.dev/anon/dev-images/anon_logo-900%403x.png">
          <h1>Redirected from Anon Link!</h1>
          <iframe
            src=${liveStreamingUrl}
            width="800"
            height="600"
            title="VNC Viewer"
            className="w-full h-[600px]"
          />
          <h2>Status: ${(req.query as any).status}</h2>
          <h3>State: ${(req.query as any).state}</h2>
        </body>
      </html>`,
    );

    console.log("[frontend]: Calling your backend server to run an action");
  });

  // Run the server!
  try {
    await fastify.listen({ port: FRONTEND_PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Start your backend server that uses the Anon Runtime SDK
const backend = async () => {
  const fastify = Fastify();

  // Declare a route to get a link url
  fastify.get("/linkUrl", async (req, reply) => {
    console.log(`[backend]:  Generating an Anon Link URL`);
    const params: URLSearchParams = new URLSearchParams({
      app: APP,
      appUserId: APP_USER_ID,
      redirectUrl: `http://localhost:${FRONTEND_PORT}/redirect`,
      // Generate a state for secure verification
      state: JSON.stringify({
        verification: APP_USER_ID,
      }),
    });

    const generateLinkUrl: string = `http://svc.${ENVIRONMENT}.anon.com/link/url?${params.toString()}`;
    const generateLinkUrlRes = await fetch(generateLinkUrl, {
      headers: {
        Authorization: `Bearer ${API_KEY}`
      }
    });
    const generateLinkUrlJson = await generateLinkUrlRes.json();

    // Forward errors
    if (generateLinkUrlRes.status !== 200) {
      return reply
        .status(generateLinkUrlRes.status)
        .send(generateLinkUrlJson)
    }

    const { url: linkUrl } = generateLinkUrlJson as {
      url: string;
    };

    // Return the linkUrl to your application
    return { linkUrl };
  });

  // Declare a route to run an action
  fastify.get("/action", async (req, reply) => {
    console.log(`[backend]:  Running action for app user id "${APP_USER_ID}"`);

    const anon = new AnonRuntime({ apiKey: API_KEY, environment: "local" });

    console.log(
      `[backend]:  Requesting ${APP} session for app user id "${APP_USER_ID}"...`,
    );
    try {

      const { result, liveStreamingUrl } = await anon.run({
        appUserId: APP_USER_ID,
        apps: ["linkedin", ],
        action: async (page) => {
          await page.goto(INITIAL_URL)
          await RUN_ACTION(page as any);
        }
      });

      console.log(liveStreamingUrl)

      reply.code(200).send(JSON.stringify({ liveStreamingUrl }))

      console.log("[backend]:  Executing runtime script...");
      console.log("[backend]:  Runtime script execution completed.");
    } catch (error) {
      console.error("[backend]:  Error:", error);
    }
  });

  // Run the server!
  try {
    await fastify.listen({ port: BACKEND_PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Start your backend and frontend servers
try {
  await backend();
  await frontend();
} catch (error) {
  console.error("Error:", error);
}

// Open Anon Link in your default browser
fetch(`http://localhost:${FRONTEND_PORT}/link`);
