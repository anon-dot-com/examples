#!/usr/bin/env node


// Utility to load environment variables into the various frontends
// that require framework-specific prefixing of environment variables
// to load them at build time.
//
// For ease of use in package.json start/build/test scripts, we detect
// the binary to inject the environment into to determine which prefix
// to use.


// this import assumes that load_env.js is called from a directory
// that has dotenv installed in its node_modules folder
const dotenv = require("dotenv")
const { spawnSync } = require("node:child_process")

const REQUIRED_ENV = [
  "ANON_ENV",
  "ANON_API_KEY",
  "ANON_SDKCLIENT_ID",
  "ANON_APP_USER_ID_TOKEN",
  "ANON_APP_USER_ID",
  "ANON_CHROME_EXTENSION_ID",
]

const checkEnv = () => {
  const setAnonVars = Object.entries(process.env)
    .filter(([k, v]) => k.startsWith("ANON_") && v != "")
    .map(([k]) => k)

  const unsetAnonVars = REQUIRED_ENV.filter(k => !setAnonVars.includes(k))

  if (unsetAnonVars.length > 0) {
    console.log("Required Anon environment variables are not set!\n")
    console.log(unsetAnonVars.join("\n") + "\n")
    console.log("Resolve this by doing any of the following:\n")
    console.log("- create in a .env file at the root of this repo with the missing variables listed above")
    console.log("- fill in the empty variables in the .env.example at the root of this repo")
    console.log("- download a pre-filled .env fom https://console.anon.com/credentials and place it at the root of this repo\n")
    process.exit(1)
  }
}

const loadEnv = () => {
  // we expect to be called with at least three arguments,
  // e.g. node load_env.js react-scripts start
  if (process.argv.length < 3) {
    console.log("missing argument: process to load environment into required")
    console.log("usage:")
    console.log("    node load_env.js <process> [...args]")
    process.exit(1)
  }

  const cmd = process.argv[2]
  let prefix;
  switch (cmd) {
    case "react-scripts":
      prefix = "REACT_APP_"
      break;
    case "vite":
    case "run-p":
      prefix = "VITE_"
      break;
    case "next":
      prefix = "NEXT_PUBLIC_"
      break;
    case "plasmo":
      prefix = "PLASMO_PUBLIC_"
      break;
    case "npx":
    case "node":
      prefix = ""
      break;
    default:
      console.log(`unknown process "${cmd}": will not prefix environment`)
      prefix = ""
      break;
  }

  // load the .env and the .env.example file which includes a default company name, etc.
  // the ordering is important, .env should override .env.example lest we set the empty 
  // example values
  // dotenv follows a "first value set for a variable will win" pattern instead of overriding
  dotenv.config({path: "../.env"})
  dotenv.config({path: "../.env.example"})

  Object.entries(process.env)
    // find all ANON_* environment variables
    .filter(([k]) => k.startsWith("ANON_"))
    // prefix them with our prefix
    .map(([k, v]) => [`${prefix}${k}`, v])
    // add them to the environment
    .forEach(([k, v]) => process.env[k] = v)

  // ensure that a .env has been created with the proper variables
  // or that all required envs have been otherwise set
  checkEnv()

  // Uncomment to debug the environment variables read and generated from the .env
  // console.log(Object.fromEntries(Object.entries(process.env).filter(([k]) => k.includes("ANON_"))))

  // run the child process
  const result = spawnSync(process.argv[2], process.argv.slice(3), {
    stdio: "inherit",
    env: process.env,
  })

  process.exit(result.status)
}

loadEnv()
