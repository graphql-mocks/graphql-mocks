const { execSync } = require('child_process');

function tagCommit(commit, tag) {
  execSync(`git tag -m ${tag} ${tag} ${commit}`, { stdio: 'ignore' });
  execSync(`git push origin ${tag}`, { stdio: 'ignore' });
}

function createGithubRelease(commit, tag) {
  if (!tag || !commit) {
    console.log(`tag and commit are required arguments, got ${tag} and ${commit} respectively`);
    return;
  }

  execSync(`gh release create ${tag} -t "${tag}" --notes "Released \\\`${tag}\\\` in ${commit}"`);
}

const gitlog = execSync(`git log --oneline`).toString().split('\n');
const publishCommits = gitlog
  .filter((logLine) => logLine.includes('Publish (#'))
  .map((line) => line.substr(0, 7))
  .map((commitHash) => {
    const message = execSync(`git log --format=%B -n 1 ${commitHash}`).toString();
    const tags = message
      .split('\n')
      .map((line) => {
        const packageRegEx = /- (.*@\d\.\d\.\d)/;
        const tag = packageRegEx.exec(line)?.[1];
        return tag;
      })
      .filter(Boolean);

    return {
      hash: commitHash,
      message,
      tags,
    };
  });

publishCommits.forEach(({ hash, tags }) => {
  tags.forEach((tag) => {
    try {
      console.log(`Tagging ${hash} with ${tag}`);
      tagCommit(hash, tag);
    } catch (e) {
      console.log(`Unable to create tag for ${tag}, skipping...`);
    }

    console.log(`Creating github release for ${tag}`);
    try {
      createGithubRelease(hash, tag);
    } catch (e) {
      console.log(`Unable to create release for ${tag}, skipping...`);
    }
  });
});
