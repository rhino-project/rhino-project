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

  shell.exec(
    `git clone git@github.com:nubinary/boilerplate_mono.git ${projectDir}`
  );

  // Navigate into the project directory's 'client' subdirectory
  shell.cd(`${projectDir}/client`);

  console.log(chalk.blue('Installing client dependencies...'));
  shell.exec('npm install --silent');

  // Navigate to the 'server' subdirectory to install modules
  shell.cd('../server');

  console.log(chalk.blue('Installing server dependencies...'));
  shell.exec('bundle install --quiet');

  console.log(chalk.blue('Installing environment variables...'));
  shell.exec('bundle exec rails rhino:dev:setup -- --no-prompt');

  answers.modules.forEach((module) => {
    console.log(chalk.blue(`Installing ${module} module...`));
    shell.exec(`bundle exec rails rhino_${module}:install --quiet`);
  });

  console.log(chalk.blue('Setting up database...'));
  shell.exec('bundle exec rails db:setup');
  shell.exec('bundle exec rails db:migrate');
  shell.exec('bundle exec rails db:reset');

  console.log(chalk.green('Project setup complete!'));
  console.log(
    chalk.green(`cd ${projectDir}/server && rails s to start development!`),
    chalk.green(`cd ${projectDir}/client && npm start to start development!`)
  );
}

main().catch((error) => console.error(chalk.red(error)));
