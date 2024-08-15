const fs = require("fs");
const path = require("path");

// A script that copies the .env file to the root of the project
// And creates a .env in this directory with the same content, but with REACT_APP_ prefix

const envPath = path.join(__dirname, "..", ".env.example");
const envReactPath = path.join(__dirname, ".", ".env");

// Allow the script to pass in a custom prefix as an env var
if (!process.env.PREFIX) {
  console.error("No PREFIX env var provided");
  process.exit(1);
}
const PREFIX = `${process.env.PREFIX}_`;

const envContent = fs.readFileSync(envPath, "utf-8");
const envReactContent = envContent
  .split("\n")
  .filter((line) => line.startsWith("ANON_"))
  .map((line) => {
    const [key, value] = line.split("=");
    return `${PREFIX}${key}=${value}`;
  })
  .join("\n");

fs.writeFileSync(envReactPath, envReactContent);
