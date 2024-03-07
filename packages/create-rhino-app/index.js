#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import shell from 'shelljs';
import kebabCase from 'kebab-case';
import { program } from 'commander'; // Import commander

program
  .option(
    '-r, --repo <type>',
    'Git repository URL',
    'https://github.com/rhino-project/rhino-project-template.git'
  )
  .option('-b, --branch <type>', 'Git branch name', 'main')
  .option('-l, --local', 'Setup project for local development');

program.parse(process.argv);

const options = program.opts();

async function docker(modules) {
  console.log(chalk.blue(`Setting up Docker Compose environment...`));
  shell.exec(`docker-compose up --wait`);

  modules.forEach((module) => {
    console.log(chalk.blue(`Installing ${module} module...`));
    shell.exec(
      `docker-compose run backend "bundle exec rails rhino_${module}:install --quiet"`
    );
  });

  if (modules.length > 0) {
    shell.exec('docker-compose restart backend');
  }

  console.log(chalk.blue(`Opening browser...`));
  shell.exec(`open http://localhost:3001`);
}

async function local(modules) {
  // Navigate into the project directory's 'client' subdirectory
  shell.cd(`client`);

  console.log(chalk.blue('Installing client dependencies...'));
  shell.exec('npm install --silent');

  // Navigate to the 'server' subdirectory to install modules
  shell.cd('../server');
  console.log(chalk.blue('Installing server dependencies...'));
  shell.exec('bundle install --quiet');

  console.log(chalk.blue('Installing environment variables...'));
  shell.exec(
    'bundle exec rails rhino:dev:setup -- --no-prompt --db-name=postgres --db-user=postgres --db-password=postgres'
  );

  modules.forEach((module) => {
    console.log(chalk.blue(`Installing ${module} module...`));
    shell.exec(`bundle exec rails rhino_${module}:install --quiet`);
  });

  console.log(chalk.blue('Setting up database...'));
  shell.exec('bundle exec rails db:setup');
  shell.exec('bundle exec rails db:migrate');
  shell.exec('bundle exec rails db:reset');
}

async function main() {
  console.log(chalk.green('Welcome to Create Rhino App'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: 'My Rhino Project'
    },
    {
      type: 'checkbox',
      name: 'modules',
      message: 'Which additional modules would you like to install?',
      choices: [
        { name: 'Organizations', value: 'organizations' },
        { name: 'Jobs', value: 'jobs' },
        { name: 'Notifications', value: 'notifications' },
        { name: 'Subscriptions', value: 'subscriptions' }
      ]
    }
  ]);

  const projectName = kebabCase(answers.projectName);
  const projectDir = projectName
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  console.log(chalk.blue(`Creating project: ${projectName} in ${projectDir}`));

  // Use the repo and branch options from commander
  shell.exec(`git clone -b ${options.branch} ${options.repo} ${projectDir}`);

  shell.cd(`${projectDir}`);

  docker(answers.modules);
  if (options.local) {
    local(answers.modules);
  } else {
    docker(answers.modules);
  }

  console.log(chalk.green('Project setup complete!'));
  console.log(
    chalk.green(`cd ${projectDir}/server && rails s to start development!`),
    chalk.green(`cd ${projectDir}/client && npm start to start development!`)
  );

  chalk.green(`cd ${projectDir} and launch editor!`);
}

main().catch((error) => console.error(chalk.red(error)));
