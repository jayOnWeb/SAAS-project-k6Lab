#!/usr/bin/env node

import { Command } from "commander";
import { VERSION } from "./utils/version.js";
import { login } from "./commands/login.js";
import { start } from "./commands/start.js";
import { status } from "./commands/status.js";
import { logout } from "./commands/logout.js";

const program = new Command();

program
  .name("k6lab-agent")
  .description("Official CLI local runner for K6 Lab load testing (Web Dashboard: https://k6lab.duckdns.org)")
  .version(VERSION);

program
  .command("login")
  .description("Login with your K6 Lab agent token (get token at https://k6lab.duckdns.org)")
  .argument("<token>", "Agent token from your K6 Lab dashboard (https://k6lab.duckdns.org)")
  .option("-u, --url <url>", "Custom backend API server URL (default: https://k6lab.duckdns.org)")
  .action((token, options) => login(token, options));

program
  .command("start")
  .description("Start agent runner daemon and listen for dashboard test jobs")
  .action(start);

program
  .command("status")
  .description("Show local agent connection and configuration status")
  .action(status);

program
  .command("logout")
  .description("Disconnect agent and remove local credentials")
  .action(logout);

program.parse();

