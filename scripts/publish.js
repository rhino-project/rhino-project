// @ts-check

// @ts-check
// Originally ported to TS from https://github.com/remix-run/react-router/tree/main/scripts/{version,publish}.js

import path from 'node:path';
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { publish } from '@tanstack/config/publish';
import chalk from 'chalk';
import * as semver from 'semver';
import currentGitBranch from 'current-git-branch';
import { parse as parseCommit } from '@commitlint/parse';
import log from 'git-log-parser';
import streamToArray from 'stream-to-array';
import { branchConfigs, packages, rootDir } from './config.js';
import { releaseCommitMsg } from './utils.js';

/**
 * Execute a script being published
 * @param {import('./types.js').RunOptions} options
 * @returns {Promise<string | undefined>}
 */
export const publishRubyHack = async (options) => {
  // eslint-disable-next-line no-shadow
  const { branchConfigs, packages, rootDir, branch, tag, ghToken } = options;

  const branchName = /** @type {string} */ (branch ?? currentGitBranch());
  const isMainBranch = branchName === 'main';
  const npmTag = isMainBranch ? 'latest' : branchName;

  /** @type {import('./types.js').BranchConfig | undefined} */
  const branchConfig = branchConfigs[branchName];

  if (!branchConfig) {
    throw new Error(`No publish config found for branch: ${branchName}`);
  }

  // Get tags
  /** @type {string[]} */
  let tags = execSync('git tag').toString().split('\n');

  // Filter tags to our branch/pre-release combo
  tags = tags
    .filter((t) => semver.valid(t))
    .filter((t) => {
      // If this is an older release, filter to only include that version
      if (branchConfig.previousVersion) {
        return t.startsWith(branchName);
      }
      if (semver.prerelease(t) === null) {
        return isMainBranch;
      } else {
        return !isMainBranch;
      }
    })
    // sort by latest
    .sort(semver.compare);

  // Get the latest tag
  let latestTag = /** @type {string} */ ([...tags].pop());

  let range = `${latestTag}..HEAD`;
  // let range = ``;

  // If RELEASE_ALL is set via a commit subject or body, all packages will be
  // released regardless if they have changed files matching the package srcDir.
  let RELEASE_ALL = true;

  if (!latestTag || tag) {
    if (tag) {
      if (!tag.startsWith('v')) {
        throw new Error(
          `tag must start with "v", eg. v0.0.0. You supplied ${tag}`
        );
      }
      console.info(
        chalk.yellow(
          `Tag is set to ${tag}. This will force release all packages. Publishing...`
        )
      );
      RELEASE_ALL = true;

      // Is it the first release? Is it a major version?
      if (!latestTag || (!semver.patch(tag) && !semver.minor(tag))) {
        range = `origin/main..HEAD`;
        latestTag = tag;
      }
    } else {
      throw new Error(
        'Could not find latest tag! To make a release tag of v0.0.1, run with TAG=v0.0.1'
      );
    }
  }

  console.info(`Git Range: ${range}`);

  /**
   * Get the commits since the latest tag
   * @type {import('./types.js').Commit[]}
   */
  const commitsSinceLatestTag = (
    await new Promise((resolve, reject) => {
      /** @type {NodeJS.ReadableStream} */
      const strm = log.parse({
        _: range
      });

      streamToArray(strm, function (err, arr) {
        if (err) return reject(err);

        Promise.all(
          arr.map(async (d) => {
            const parsed = await parseCommit(d.subject);

            return { ...d, parsed };
          })
        ).then((res) => resolve(res.filter(Boolean)));
      });
    })
  ).filter((/** @type {import('./types.js').Commit} */ commit) => {
    const exclude = [
      commit.subject.startsWith('Merge branch '), // No merge commits
      commit.subject.startsWith(releaseCommitMsg('')) // No example update commits
    ].some(Boolean);

    return !exclude;
  });

  console.info(
    `Parsing ${commitsSinceLatestTag.length} commits since ${latestTag}...`
  );

  /**
   * Parses the commit messsages, log them, and determine the type of release needed
   * -1 means no release is necessary
   * 0 means patch release is necessary
   * 1 means minor release is necessary
   * 2 means major release is necessary
   * @type {number}
   */
  let recommendedReleaseLevel = commitsSinceLatestTag.reduce(
    (releaseLevel, commit) => {
      if (commit.parsed.type) {
        if (['fix', 'refactor', 'perf'].includes(commit.parsed.type)) {
          releaseLevel = Math.max(releaseLevel, 0);
        }
        if (['feat'].includes(commit.parsed.type)) {
          releaseLevel = Math.max(releaseLevel, 1);
        }
        if (commit.body.includes('BREAKING CHANGE')) {
          releaseLevel = Math.max(releaseLevel, 2);
        }
        if (
          commit.subject.includes('RELEASE_ALL') ||
          commit.body.includes('RELEASE_ALL')
        ) {
          RELEASE_ALL = true;
        }
      }

      return releaseLevel;
    },
    -1
  );

  /**
   * Uses git diff to determine which files have changed since the latest tag
   * @type {string[]}
   */
  const changedFiles = tag
    ? []
    : execSync(`git diff ${latestTag} --name-only`)
        .toString()
        .split('\n')
        .filter(Boolean);

  /** Uses packages and changedFiles to determine which packages have changed */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const changedPackages = RELEASE_ALL
    ? packages
    : packages.filter((pkg) => {
        const changed = changedFiles.some((file) =>
          file.startsWith(path.join(pkg.packageDir))
        );
        return changed;
      });

  if (!tag) {
    if (recommendedReleaseLevel === 2) {
      console.info(
        `Major versions releases must be tagged and released manually.`
      );
      return;
    }

    if (recommendedReleaseLevel === -1) {
      console.info(
        `There have been no changes since the release of ${latestTag} that require a new version. You're good!`
      );
      return;
    }
  }

  if (tag && recommendedReleaseLevel === -1) {
    recommendedReleaseLevel = 0;
  }

  const releaseType = branchConfig.prerelease
    ? 'prerelease'
    : /** @type {const} */ ({ 0: 'patch', 1: 'minor', 2: 'major' })[
        recommendedReleaseLevel
      ];

  if (!releaseType) {
    throw new Error(`Invalid release level: ${recommendedReleaseLevel}`);
  }

  const npmVersion = tag
    ? semver.parse(tag)?.version
    : semver.inc(latestTag, releaseType, npmTag);

  if (!npmVersion) {
    throw new Error(
      `Invalid version increment from semver.inc(${[
        latestTag,
        recommendedReleaseLevel,
        branchConfig.prerelease
      ].join(', ')}`
    );
  }

  const version = npmVersion.replace(/-/g, '.');

  if (changedPackages.length === 0) {
    console.info('No packages have been affected.');
    return;
  }

  console.info(`  Updating RHINO_PROJECT_VERSION version to ${version}...`);

  const versionFilePath = path.resolve(
    rootDir,
    'gems',
    'RHINO_PROJECT_VERSION'
  );
  writeFileSync(versionFilePath, version);

  if (!process.env.CI) {
    console.warn(
      `This is a dry run for version ${version}. Push to CI to publish for real or set CI=true to override!`
    );
    return;
  }

  console.info();
  console.info(`Publishing all packages to rubygems with tag "${npmTag}"`);

  // Publish each package
  if (changedPackages.length > 0) {
    const gemDir = path.join(rootDir, 'gems');

    const cmd = `SKIP_TAG=1 bundle exec rake release`;
    console.info(`  Publishing gems to rubygems with ${cmd}...`);
    execSync(cmd, {
      cwd: gemDir,
      stdio: [process.stdin, process.stdout, process.stderr]
    });
  }

  console.info('All done!');

  return changedPackages.length > 0 ? npmVersion : undefined;
};

const publishConfig = {
  branchConfigs,
  packages,
  rootDir,
  branch: process.env.BRANCH,
  tag: process.env.TAG,
  ghToken: process.env.GH_TOKEN,
  releaseAll: true
};

const rubyTag = await publishRubyHack({
  ...publishConfig,
  packages: [
    {
      name: 'rhino_project_core',
      packageDir: 'gems/rhino_project_core'
    },
    {
      name: 'rhino_project_organizations',
      packageDir: 'gems/rhino_project_organizations'
    },
    {
      name: 'rhino_project_jobs',
      packageDir: 'gems/rhino_project_jobs'
    },
    {
      name: 'rhino_project_notifications',
      packageDir: 'gems/rhino_project_notifications'
    },
    {
      name: 'rhino_project_subscriptions',
      packageDir: 'gems/rhino_project_subscriptions'
    },
    {
      name: 'rubocop-rhino-project',
      packageDir: 'gems/rubocop-rhino-project'
    }
  ]
});

await publish({
  ...publishConfig,
  // Use the tag from the ruby publish if it exists to ensure its tagged
  tag: process.env.TAG || rubyTag
});

process.exit(0);
