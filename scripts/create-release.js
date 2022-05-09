/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const { execSync } = require('child_process');
const { exit } = require('process');
const semver = require('semver');
const chalk = require('chalk');
const { writeFileSync, readFileSync } = require('fs');
const path = require('path');

function yarnAndLink() {
  console.log(chalk.blue(`running \`yarn\` and \`yarn link-packages\``));
  execSync(`yarn`);
  execSync(`yarn link-packages`);
  console.log(chalk.green(`✅ finished running \`yarn\` and \`yarn link-packages\``));
}

function getLernaPackages({ changed } = { changed: false }) {
  if (changed) {
    return JSON.parse(execSync('yarn --silent run lerna changed --json').toString());
  } else {
    return JSON.parse(execSync('yarn --silent run lerna ls --json').toString());
  }
}

function getPublishedVersions(package) {
  try {
    return JSON.parse(execSync(`yarn info --json ${package}`).toString()).data.versions;
  } catch {
    return [];
  }
}

let indentLevel = 0;
function step(message) {
  return {
    start: () => (indentLevel++, console.log(chalk.blue(`${' '.repeat(2 * indentLevel)} ➡️  [START] ${message}`))),
    stop: () => (indentLevel--, console.log(chalk.blue(`${' '.repeat(2 * indentLevel)} ⬅️  [STOP] ${message}`))),
    error: () => (indentLevel--, console.log(chalk.red(`${' '.repeat(2 * indentLevel)} ❌ [ERROR] ${message}`))),
  };
}

function checkPackagePeerDependencies(package, packages) {
  const checkPackagePeers = step(`${package.name} peerDependency checks`);
  checkPackagePeers.start();

  getLernaPackages({ changed: true })
    .filter(({ name }) => Object.keys(package?.peerDependencies ?? {}).includes(name))
    .map(({ name }) => packages.find((pkg) => pkg.name === name))
    .filter(Boolean)
    .forEach((peerPackage) => {
      try {
        testPackage(package, peerPackage);
      } catch (e) {
        package.markBreakingPeer(peerPackage);
        console.log(chalk.red(e));
      }
    });

  console.log('');
  if (package.breakingPeers.length) {
    console.log('');
    console.log(
      chalk.yellow(
        ` ⚠️  package ${package.name} has breaking peerDependencies: ${package.breakingPeers
          .map(({ name }) => name)
          .join(', ')}`,
      ),
    );
    console.log('');
  }

  checkPackagePeers.stop();

  console.log(chalk.blue('restoring package dependencies with yarn and re-linking'));
  yarnAndLink();
}

function announceBrokenPeerDependencies(packages) {
  console.log(chalk.yellow(`⚠️  Broken Peer Dependencies:`));
  console.log(chalk.yellow(`----------------------------------------------------`));
  packages.forEach((package) => {
    if (!package.breakingPeers.length) {
      return;
    }

    console.log(
      chalk.yellow(
        `package: ${package.name} with peer dependency: ${package.breakingPeers.map(({ name }) => name).join(', ')}`,
      ),
    );
  });
  console.log(chalk.yellow(`----------------------------------------------------`));
}

function testPackage(package, peerPackage) {
  const range = package.peerDependencies[peerPackage.name];

  const testPeerRange = step(`testing package ${package.name} with peer ${peerPackage.name}: ${range}`);
  testPeerRange.start();

  const testVersions = (peerPackage.publishedVersions ?? []).filter((version) => semver.satisfies(version, range));

  try {
    testVersions.forEach((version) => {
      const testPeerVersion = step(`Testing ${package.name} with peer version ${peerPackage.name}@${version}`);
      try {
        testPeerVersion.start();
        execSync(`yarn run lerna exec --scope ${package.name} "npm install --no-save ${peerPackage.name}@${version}"`);
        execSync(`yarn run lerna run --scope ${package.name} test`);
        testPeerVersion.stop();
      } catch (e) {
        testPeerVersion.error();
        throw e;
      }
    });

    testPeerRange.stop();
  } catch (e) {
    testPeerRange.error();
    throw e;
  }
}

function commitsSincePublish() {
  const logs = execSync(`git log --oneline`).toString().split('\n');

  const commits = [];
  for (const line of logs) {
    if (line.includes('Publish (#')) {
      break;
    }

    const commit = line.substr(0, 7);
    commits.push(commit);
  }

  return commits;
}

function attachChangelogs(packages) {
  const commits = commitsSincePublish();
  const messages = commits.map((commit) => execSync(`git log --format=%B -n 1 ${commit}`).toString());

  const prNumbers = messages
    .map((message) => {
      message = message.trim();
      const prRegEx = /\(#(\d+)\)/;
      const prNumber = prRegEx.exec(message)?.[1];
      return prNumber;
    })
    .filter(Boolean);

  const changelogs = [];
  prNumbers.forEach((prNum) => {
    const pr = JSON.parse(execSync(`gh pr view ${prNum} --json body,title,number,url`).toString().trim());
    const { body: content, title, number, url } = pr;
    const changelogRegex = new RegExp(/```markdown changelog\((.*?)\)(.*?)```/, 'gms');

    let result;
    while ((result = changelogRegex.exec(content)) !== null) {
      const [, package, entry] = result;
      if (!package) {
        throw new Error(`Expected specific package for changelog entry, got ${package} in :\n${content}`);
      }
      changelogs.push({ package, entry: entry.trim(), pr: { title, number, url } });
    }
  });

  changelogs.forEach(({ package: packageName, entry, pr }) => {
    const package = packages.find(({ name }) => name === packageName);
    package.changelogEntries.push({ entry, pr });
  });
}

function announcePackageChangelogs(packages) {
  console.log();
  console.log(chalk.blue('Package Changelogs'));
  packages.forEach((package) => {
    if (!package.changelogEntries.length) {
      return;
    }

    console.log();
    console.log(chalk.bold(package.name));
    if (package.containsBreakingChange) {
      console.log(chalk.red('** contains breaking change ** '));
    }
    console.log('\n---\n');
    package.changelogEntries.forEach(({ entry, pr }) => {
      console.log(`${pr.title} (#${pr.number})`);
      console.log(`${pr.url}`);
      console.log();
      console.log(entry);
      console.log('\n---\n');
    });
  });
}

function yarnBootstrap() {
  console.log(chalk.blue('running yarn bootstrap'));
  execSync(`yarn bootstrap`);
  console.log(chalk.green('✅ finished running yarn bootstrap'));
}

function yarnBuild() {
  console.log(chalk.blue('running yarn build'));
  execSync(`yarn build`);
  console.log(chalk.green('✅ finished running yarn build'));
}

function createReleaseBranch() {
  const commit = execSync('git rev-parse --short HEAD').toString().trim();
  execSync(`git checkout -b release-${commit}`);
}

function lernaVersion() {
  execSync('yarn run lerna version --no-git-tag-version --no-push', {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  });
}

function checkMainBranch() {
  const currentBranch = execSync('git branch --show-current').toString().trim();
  if (currentBranch !== 'main') {
    console.error(chalk.red('  ⚠️ Ensure create-release is ran from the main branch '));
    exit(-1);
  }
}

function checkCleanBranch() {
  // run yarn, if there are changes to yarn.lock then
  // the clean working directory check will fail
  console.log(chalk.blue('  Running yarn, to ensure no uncommitted changes to yarn.lock'));
  execSync('yarn', { stdio: 'ignore' });

  const cleanWorkingDirectory = execSync('git status --porcelain').toString().trim() === '';
  if (!cleanWorkingDirectory) {
    console.error(chalk.red('  ⚠️ Error: Ensure clean working directory before creating release pr '));
    exit(-1);
  }
}

function updatePeerDependencies(package, allPackages) {
  Object.keys(package.peerDependencies).forEach((peerName) => {
    const lernaPackageNames = getLernaPackages().map(({ name }) => name);
    if (!lernaPackageNames.includes(peerName)) {
      // peer package is not a managed graphql-mocks package, skip.
      return;
    }

    const peer = allPackages.find(({ name }) => name === peerName);
    const peerIsBreaking = Boolean(package.breakingPeers.find((breakingPeer) => breakingPeer.name === peer.name));
    const currentPeerRange = package.peerDependencies[peerName];
    const peerVersions = [...peer.publishedVersions, peer.version];
    const updatedPeerRange = peerIsBreaking
      ? `^${peer.version}`
      : semver.simplifyRange(peerVersions, `${currentPeerRange} || ${peer.version}`);

    package.peerDependencies[peer.name] = updatedPeerRange;
  });
}

function createChangeLogEntries(packages) {
  console.log(chalk.blue('Creating changelog entries'));
  const changelogPath = path.resolve(__dirname, '../CHANGELOG.md');
  let changelogContents = readFileSync(changelogPath).toString();

  packages.forEach((package) => {
    const packageHeading = `## ${package.name}`;
    const hasExistingPackageEntries = changelogContents.includes(packageHeading);
    const hasNewPackageEntries = package.changelogEntries.length > 0;

    if (!hasNewPackageEntries) {
      console.log(chalk.yellow(`No changelog entries for ${package.name}, skipping.`));
      return;
    }

    const versionHeading = `### ${package.name}@${package.version}`;
    const entries = package.changelogEntries.map(({ entry, pr }) => {
      return `
#### ${pr.title} ([#${pr.number}](${pr.url}))

${entry}
    `.trim();
    });

    const packageEntries = `${packageHeading}\n\n${versionHeading}\n\n${entries.join('\n\n')}`;

    if (hasExistingPackageEntries) {
      changelogContents = changelogContents.replace(packageHeading, packageEntries);
    } else {
      changelogContents = changelogContents.concat(`\n\n${packageEntries}`);
    }

    console.log(chalk.green(`✅ updated package entries for ${package.name}`));
  });

  console.log(chalk.green(`✅ wrote CHANGELOG.md`));
  writeFileSync(changelogPath, changelogContents);
}

function commitChangesWithFormattedMessage(packages) {
  const formattedPackageNames = packages
    .filter((package) => package.previousVersion !== null)
    .map((package) => {
      return ` - ${package.name}@${package.version}`;
    });

  const commitMessage = `Publish\n\n${formattedPackageNames.join('\n')}`;
  execSync(`git add .`);
  execSync(`git commit -m "${commitMessage}"`);
}

class Package {
  path;
  name;
  pjson;
  containsBreakingChange = false;
  changelogEntries = [];
  publishedVersions = [];
  breakingPeers = [];
  previousVersion = null;

  get version() {
    return this.pjson?.version;
  }

  set version(value) {
    this.pjson.version = value;
  }

  get peerDependencies() {
    return this.pjson?.peerDependencies;
  }

  constructor({ path, name }) {
    this.path = path;
    this.name = name;
    this.publishedVersions = getPublishedVersions(name);
    this.loadPjson();
  }

  markBreakingPeer(peer) {
    this.containsBreakingChange = true;
    this.breakingPeers.push(peer);
  }

  loadPjson() {
    const newPjson = JSON.parse(readFileSync(`${this.path}/package.json`).toString());
    const newVersionExists = this.version !== newPjson.version;

    if (newVersionExists) {
      this.previousVersion = this.version;
    }

    this.pjson = newPjson;
  }

  write() {
    const { path } = this;
    writeFileSync(`${path}/package.json`, JSON.stringify(this.pjson, null, 2));
  }
}

try {
  checkMainBranch();
  checkCleanBranch();
  createReleaseBranch();
  yarnAndLink();
  yarnBootstrap();

  const packages = getLernaPackages().map((lernaPackage) => {
    const { name, location: path } = lernaPackage;
    return new Package({ name, path });
  });

  packages.forEach((package) => checkPackagePeerDependencies(package, packages));
  announceBrokenPeerDependencies(packages);
  attachChangelogs(packages);
  announcePackageChangelogs(packages);

  lernaVersion();

  // lerna version will have updated package.json versions
  // the pjson loaded on each `Package` should be updated
  packages.forEach((package) => package.loadPjson());

  // update peer dependencies based on new package.json
  // version numbers
  packages.forEach((package) => updatePeerDependencies(package, packages));

  // write peerDependency changes back to package.json
  packages.forEach((package) => package.write());

  // must come after versioning (especially for the case of the cli for the oclif manifest)
  yarnBuild();

  createChangeLogEntries(packages);
  commitChangesWithFormattedMessage(packages);
} catch (e) {
  console.log(chalk.red('An error occurred in creating the release:'));
  console.log(chalk.red(e.message));
  throw e;
}
