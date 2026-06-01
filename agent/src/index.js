#!/usr/bin/env node

import { Command } from "commander";
import { login } from "./commands/login.js";
import { start } from "./commands/start.js";
import { status } from "./commands/status.js";
import { logout } from "./commands/logout.js";

const program = new Command();

program
  .name("k6lab-agent")
  .description("Local agent for K6 Lab")
  .version("1.0.0");

program
  .command("login")
  .description("Login with your K6 Lab agent token")
  .argument("<token>", "Agent token from K6 Lab dashboard")
  .action(login);

program
  .command("start")
  .description("Start agent and wait for dashboard jobs")
  .action(start);

program
  .command("status")
  .description("Show local agent login status")
  .action(status);

program
  .command("logout")
  .description("Remove local agent token")
  .action(logout);

program.parse();
