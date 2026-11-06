// Read-only snapshot of the ball website repo into data/*.json. Never writes to the source repo.
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(process.argv[2] || resolve(root, '../plesoktava'));
const git = (...a) => execFileSync('git', ['-C', src, ...a], { encoding: 'utf8' });

const raw = git('log', '--reverse', '--date=iso-strict', '--pretty=format:@@%H|%h|%ad|%s', '--shortstat');
const commits = raw.split('@@').filter(Boolean).map(block => {
  const [head, ...rest] = block.trim().split('\n');
  const [hash, short, date, ...msg] = head.split('|');
  const stat = rest.join(' ');
  const n = re => Number((stat.match(re) || [0, 0])[1]);
  return { hash, short, date, message: msg.join('|'), files: n(/(\d+) files? changed/), add: n(/(\d+) insertions?/), del: n(/(\d+) deletions?/) };
});

const files = git('ls-files').split('\n').filter(Boolean);
const tree = {};
for (const f of files) {
  let node = tree;
  const parts = f.split('/');
  parts.forEach((p, i) => { node = node[p] ??= (i === parts.length - 1 ? null : {}); });
}

mkdirSync(resolve(root, 'data'), { recursive: true });
writeFileSync(resolve(root, 'data/commits.json'), JSON.stringify(commits, null, 1));
writeFileSync(resolve(root, 'data/tree.json'), JSON.stringify(tree, null, 1));
console.assert(commits.length > 0 && files.length > 0, 'empty repo snapshot');
console.log(`${commits.length} commits, ${files.length} files`);
// file:// pages can't fetch JSON, so also expose the snapshot as a script
writeFileSync(resolve(root, 'data/data.js'), `window.DATA=${JSON.stringify({ commits, tree })};\n`);
