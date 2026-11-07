import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await fs.readFile(path.join(root, 'upstream.json'), 'utf8'));
let destination = path.join(os.homedir(), '.agents/skills');
let apply = false;
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '--apply') apply = true;
  else if (process.argv[i] === '--dest' && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) destination = path.resolve(process.argv[++i]);
  else if (process.argv[i] === '--help') {
    console.log('Usage: node scripts/install.mjs [--dest DIRECTORY] [--apply]\nDefault: preview links in ~/.agents/skills. --apply is required to install. Existing skills are never replaced.');
    process.exit(0);
  } else throw new Error(`Unknown or incomplete option: ${process.argv[i]}`);
}

const plan = [];
for (const name of manifest.skills) {
  const source = path.join(root, 'skills', name);
  await fs.access(path.join(source, 'SKILL.md'));
  const target = path.join(destination, name);
  const existing = await fs.lstat(target).catch(error => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  if (existing) {
    if (existing.isSymbolicLink() && await fs.realpath(target).catch(() => null) === await fs.realpath(source)) continue;
    throw new Error(`Skill already exists; nothing installed: ${target}`);
  }
  plan.push({ source, target });
}
console.log(`${apply ? 'Install' : 'Preview only'}: ${plan.length} skill link(s) in ${destination}`);
for (const item of plan) console.log(`${item.target} -> ${item.source}`);
if (apply) {
  await fs.mkdir(destination, { recursive: true });
  for (const { source, target } of plan) await fs.symlink(source, target, 'dir');
}
