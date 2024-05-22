#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import shell from 'shelljs';
import { program } from 'commander';
import fs from 'fs';
import semver from 'semver';

program
  .option(
    '-r, --repo <type>',
    'Git repository URL',
    'https://github.com/rhino-project/rhino-project-template.git'
  )
  .option('-b, --branch <type>', 'Git branch name', 'main');

program.parse(process.argv);

const options = program.opts();

async function main() {
  console.log(chalk.green('Welcome to Create Rhino App'));

  const dockerComposeVersion = shell.exec('docker compose version', {
    silent: true
  }).stdout;
  const dockerComposeMatch = dockerComposeVersion.match(/(\d+\.\d+\.\d+)/);
  const dockerComposeValid = dockerComposeMatch
    ? semver.gte(dockerComposeMatch[1], '2.20.3')
    : false;

  const environments = [
    {
      name: 'Docker (2.20.3 or greater)',
      value: 'docker',
      disabled: !dockerComposeValid
        ? 'Docker Compose 2.20.3 or greater not available'
        : false
    },
    {
      name: 'asdf',
      value: 'asdf',
      disabled: !shell.which('asdf') ? 'asdf not available' : false
    },
    {
      name: 'NixOS',
      value: 'nixos',
      disabled: true // !shell.which('nix-shell') ? 'NixOS not available' : false
    }
  ];

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: 'My Rhino Project'
    },
    {
      type: 'list',
      name: 'devEnv',
      message: 'Which development environment would you like to use?',
      choices: environments
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

  const projectName = answers.projectName;
  const projectDir = projectName
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  if (fs.existsSync(projectDir)) {
    console.error(chalk.red(`Error: Directory ${projectDir} already exists.`));
    process.exit(1);
  }

  console.log(chalk.blue(`Creating project: ${projectName} in ${projectDir}`));

  // Use the repo and branch options from commander
  if (
    shell.exec(`git clone -b ${options.branch} ${options.repo} ${projectDir}`)
      .code !== 0
  ) {
    console.error(chalk.red('Error cloning repository'));
    process.exit(1);
  }

  // Assume start in the project directory and end in the project directory
  shell.cd(projectDir);
  if (answers.devEnv === 'asdf') {
    setupAsdfEnvironment();
    setupModulesAndDatabase(answers.modules);
  } else if (answers.devEnv === 'docker') {
    setupDockerEnvironment(projectDir, answers.modules);
  } else if (answers.devEnv === 'nixos') {
    setupNixOSEnvironment();
    setupModulesAndDatabase(answers.modules);
  }

  if (answers.devEnv !== 'docker') {
    console.log(
      chalk.green(`cd ${projectDir}/server && rails s to start development!`),
      chalk.green(`cd ${projectDir}/client && npm start to start development!`)
    );
  } else {
    shell.exec('open http://localhost:3001');
  }
  console.log(
    chalk.green(
      'Project setup complete! Login with test@example.com / password'
    )
  );
}

function setupAsdfEnvironment() {
  console.log(chalk.blue('Setting up asdf environment...'));
  shell.exec('asdf install');

  if (shell.cd('client').code !== 0) {
    console.error(chalk.red('Error navigating to client directory'));
    process.exit(1);
  }
  console.log(chalk.blue('Installing client dependencies...'));
  shell.exec('npm install --silent');

  shell.cd('..');
  if (shell.cd('server').code !== 0) {
    console.error(chalk.red('Error navigating to server directory'));
    process.exit(1);
  }
  console.log(chalk.blue('Installing server dependencies...'));
  shell.exec('bundle install --quiet');

  shell.cd('..');
}

function setupDockerEnvironment(projectName, modules) {
  console.log(chalk.blue('Setting up Docker environment...'));

  const envContent = `COMPOSE_PROJECT_NAME=${projectName}`;
  fs.writeFileSync('.env', envContent);
  console.log(chalk.blue('Created .env file with COMPOSE_PROJECT_NAME'));

  shell.exec('docker-compose up --wait --quiet-pull');

  modules.forEach((module) => {
    console.log(chalk.blue(`Installing ${module} module...`));
    shell.exec(
      `docker-compose exec backend bundle exec rails rhino_${module}:install --quiet`
    );
  });

  if (modules.length > 0) {
    shell.exec('docker-compose exec backend bundle exec rails db:migrate');
    shell.exec('docker-compose exec backend bundle exec rails db:seed');
    shell.exec('docker-compose restart backend');
  }
}

function setupNixOSEnvironment() {
  console.log(chalk.blue('Setting up NixOS environment...'));
  shell.exec('nix-shell');

  if (shell.cd('client').code !== 0) {
    console.error(chalk.red('Error navigating to client directory'));
    process.exit(1);
  }
  console.log(chalk.blue('Installing client dependencies...'));
  shell.exec('npm install --silent');

  shell.cd('..');
  if (shell.cd('server').code !== 0) {
    console.error(chalk.red('Error navigating to server directory'));
    process.exit(1);
  }
  console.log(chalk.blue('Installing server dependencies...'));
  shell.exec('bundle install --quiet');

  shell.cd('..');
}

function setupModulesAndDatabase(modules) {
  if (shell.cd('server').code !== 0) {
    console.error(chalk.red('Error navigating to server directory'));
    process.exit(1);
  }

  console.log(chalk.blue('Installing environment variables...'));
  shell.exec('bundle exec rails rhino:dev:setup -- --no-prompt');

  modules.forEach((module) => {
    console.log(chalk.blue(`Installing ${module} module...`));
    shell.exec(`bundle exec rails rhino_${module}:install --quiet`);
  });

  console.log(chalk.blue('Setting up database...'));
  shell.exec('bundle exec rails db:setup');
  shell.exec('bundle exec rails db:migrate');
  shell.exec('bundle exec rails db:reset');

  shell.cd('..');
}

main().catch((error) => console.error(chalk.red(error)));
