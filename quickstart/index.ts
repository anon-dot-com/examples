import Fastify from "fastify";
import cors from "@fastify/cors";
import { LinkedIn, NetworkHelper } from "@anon/actions";
import { AnonRuntime, Environment, AppIntegration } from "@anon/sdk-typescript";
import open from "open";

const API_KEY = process.argv[2];
if (!API_KEY) {
  console.error("Usage: yarn run quickstart <API_KEY>");
  process.exit(1);
}

// Basic configuration
const port = 4000;
const app: AppIntegration = "linkedin";
const environment: Environment = "sandbox";
const appUserId = "quickstart-user@example.com";

async function startServer() {
  const fastify = Fastify();
  fastify.register(cors);

  // Single endpoint to handle the entire flow
  fastify.get("/start", async (req, reply) => {
    const params = new URLSearchParams({
      app,
      appUserId,
      redirectUrl: `http://localhost:${port}/callback`,
      state: appUserId,
    });

    const linkRes = await fetch(
      `https://svc.${environment}.anon.com/link/url?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
      },
    );

    const { url } = (await linkRes.json()) as { url: string };
    console.log("Running Anon Link:");
    console.log(url);
    await open(url);

    return { message: "Anon Link opened in browser" };
  });

  // Simple callback endpoint, run the action and show success/error message
  fastify.get("/callback", async (req, reply) => {
    const anon = new AnonRuntime({
      apiKey: API_KEY,
      environment,
    });

    // Run the action
    console.log("Creating LinkedIn post...");
    try {
      const { result } = await anon.run({
        appUserId,
        apps: [app],
        action: async (page) => {
          await page.goto("https://linkedin.com");
          await LinkedIn.createPost(
            new NetworkHelper(5000),
            "Testing Anon.com - automatically posted! Learn more at Anon.com",
          )(page as any);
        },
      });

      // Await the successful completion of the action
      await result;

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

  await fastify.listen({ port });

  // Automatically open the browser
  fetch(`http://localhost:${port}/start`);
}

startServer().catch(console.error);
