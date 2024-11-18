import Fastify from "fastify";
import cors from "@fastify/cors";
import { LinkedIn, NetworkHelper } from "@anon/actions";
import { AnonRuntime, Environment } from "@anon/sdk-typescript";
import open from "open";

const API_KEY = process.argv[2];
if (!API_KEY) {
  console.error("Usage: yarn run quickstart <API_KEY>");
  process.exit(1);
}

// Basic configuration
const config = {
  port: 4000,
  app: "linkedin",
  userId: "quickstart-user",
  environment: "sandbox" as Environment,
};

// Single action example
const postAction = LinkedIn.createPost(
  new NetworkHelper(5000),
  "Testing Anon.com - automatically posted! Learn more at Anon.com",
);

async function startServer() {
  const fastify = Fastify();
  fastify.register(cors);

  // Single endpoint to handle the entire flow
  fastify.get("/start", async (req, reply) => {
    const anon = new AnonRuntime({
      apiKey: API_KEY,
      environment: config.environment,
    });

    // Generate link URL
    const params = new URLSearchParams({
      app: config.app,
      appUserId: config.userId,
      redirectUrl: `http://localhost:${config.port}/callback`,
      state: config.userId,
    });

    const linkRes = await fetch(
      `https://svc.${
        config.environment
      }.anon.com/link/url?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
      },
    );

    const { url: linkUrl } = (await linkRes.json()) as { url: string };

    // Open the link URL
    await open(linkUrl);

    return { message: "Anon Link opened in browser" };
  });

  // Simple callback endpoint
  fastify.get("/callback", async (req, reply) => {
    const anon = new AnonRuntime({
      apiKey: API_KEY,
      environment: config.environment,
    });

    // Run the action
    try {
      const { result } = await anon.run({
        appUserId: config.userId,
        apps: [config.app],
        action: async (page) => {
          await page.goto("https://linkedin.com");
          await postAction(page as any);
        },
      });

      return reply.type("text/html").send(`
        <h1>Action Completed!</h1>
        <p>Check your LinkedIn profile for the new post.</p>
      `);
    } catch (error) {
      return reply.type("text/html").send(`
        <h1>Error</h1>
        <p>Failed to complete action: ${JSON.stringify(error)}</p>
      `);
    }
  });

  await fastify.listen({ port: config.port });
  console.log(`Server running at http://localhost:${config.port}`);

  // Start the flow automatically
  fetch(`http://localhost:${config.port}/start`);
}

startServer().catch(console.error);
