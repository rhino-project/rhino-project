#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import shell from 'shelljs';
import kebabCase from 'kebab-case';

async function main() {
  console.log(chalk.green('Welcome to Create Rhino App'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: 'My Rhino Project'
    }
  ]);

  const projectName = kebabCase(answers.projectName);
  const projectDir = projectName
    .trim() // Remove leading and trailing spaces
    .replace(/[^a-zA-Z0-9]+/g, '-') // Replace spaces and special chars with -
    .replace(/^-+|-+$/g, '') // Remove leading and trailing -
    .toLowerCase(); // Convert to lower case
  console.log(chalk.blue(`Creating project: ${projectName} in ${projectDir}`));

  // Clone your template repo (replace with your actual template repository URL)
  shell.exec(
    `git clone git@github.com:nubinary/boilerplate_mono.git ${projectDir}`
  );

  // Navigate into the project directory
  shell.cd(projectDir);

  // Initialize a new git repository
  shell.exec('git init');

  // Install dependencies
  shell.exec('pnpm install');

  console.log(chalk.green('Project setup complete!'));
  console.log(
    chalk.green(`cd ${projectDir} && pnpm run dev to start development!`)
  );
}

main().catch((error) => console.error(chalk.red(error)));
