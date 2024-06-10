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
  });
  if (dockerComposeVersion.code !== 0) {
    console.error(chalk.red('Error checking Docker Compose version.'));
    process.exit(1);
  }

  const dockerComposeMatch =
    dockerComposeVersion.stdout.match(/(\d+\.\d+\.\d+)/);
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
      chalk.green(`cd ${projectDir}/server && rails s to start development!`)
    );
    console.log(
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

function execWithCheck(command, errorMessage) {
  const result = shell.exec(command);
  if (result.code !== 0) {
    console.error(chalk.red(errorMessage));
    process.exit(1);
  }
}

function setupAsdfEnvironment() {
  console.log(chalk.blue('Setting up asdf environment...'));
  execWithCheck('asdf install', 'Error installing asdf versions.');

  execWithCheck('cd client', 'Error navigating to client directory');
  console.log(chalk.blue('Installing client dependencies...'));
  execWithCheck(
    'npm install --silent',
    'Error installing client dependencies.'
  );

  execWithCheck('cd ../server', 'Error navigating to server directory');
  console.log(chalk.blue('Installing server dependencies...'));
  execWithCheck(
    'bundle install --quiet',
    'Error installing server dependencies.'
  );

  shell.cd('..');
}

function setupDockerEnvironment(projectName, modules) {
  console.log(chalk.blue('Setting up Docker environment...'));

  const envContent = `COMPOSE_PROJECT_NAME=${projectName}`;
  fs.writeFileSync('.env', envContent);
  console.log(chalk.blue('Created .env file with COMPOSE_PROJECT_NAME'));

  execWithCheck(
    'docker compose up --wait --quiet-pull',
    'Error starting Docker Compose.'
  );

  modules.forEach((module) => {
    console.log(chalk.blue(`Installing ${module} module...`));
    execWithCheck(
      `docker compose exec backend bundle exec rails rhino_${module}:install --quiet`,
      `Error installing ${module} module.`
    );
  });

  if (modules.length > 0) {
    execWithCheck(
      'docker compose restart backend',
      'Error restarting backend.'
    );
    execWithCheck('docker compose up --wait', 'Error starting Docker Compose.');
    execWithCheck(
      'docker compose exec backend bundle exec rails db:seed:replant',
      'Error seeding database.'
    );
  }
}

function setupNixOSEnvironment() {
  console.log(chalk.blue('Setting up NixOS environment...'));
  execWithCheck('nix-shell', 'Error starting NixOS shell.');

  execWithCheck('cd client', 'Error navigating to client directory');
  console.log(chalk.blue('Installing client dependencies...'));
  execWithCheck(
    'npm install --silent',
    'Error installing client dependencies.'
  );

  execWithCheck('cd ../server', 'Error navigating to server directory');
  console.log(chalk.blue('Installing server dependencies...'));
  execWithCheck(
    'bundle install --quiet',
    'Error installing server dependencies.'
  );

  shell.cd('..');
}

function setupModulesAndDatabase(modules) {
  execWithCheck('cd server', 'Error navigating to server directory');

  console.log(chalk.blue('Installing environment variables...'));
  execWithCheck(
    'bundle exec rails rhino:dev:setup -- --no-prompt',
    'Error setting up environment variables.'
  );

  modules.forEach((module) => {
    console.log(chalk.blue(`Installing ${module} module...`));
    execWithCheck(
      `bundle exec rails rhino_${module}:install --quiet`,
      `Error installing ${module} module.`
    );
  });

  console.log(chalk.blue('Setting up database...'));
  execWithCheck('bundle exec rails db:setup', 'Error setting up database.');
  execWithCheck('bundle exec rails db:migrate', 'Error migrating database.');
  execWithCheck('bundle exec rails db:reset', 'Error resetting database.');

  shell.cd('..');
}

main().catch((error) => console.error(chalk.red(error)));
