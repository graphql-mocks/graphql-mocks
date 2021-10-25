/* eslint-disable @typescript-eslint/no-var-requires */

const { execSync } = require('child_process');

const gitTags = execSync(`git tag -l`).toString().split('\n');

function tagCommit(commit, tag) {
  execSync(`git tag --force ${tag} ${commit}`);
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
    console.log(`Tagging ${hash} with ${tag}`);
    tagCommit(hash, tag);
  });
});
