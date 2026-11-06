import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = path.resolve(root, '..');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'upstream.json'), 'utf8'));
const check = process.argv.includes('--check');
if (process.argv.slice(2).some(arg => arg !== '--check')) throw new Error('Usage: node scripts/build.mjs [--check]');
const primary = new Set(manifest.skills);
const dependency = new Set(manifest.dependencies);
const outputs = new Map();
const sha256 = text => createHash('sha256').update(text).digest('hex');
const stripFrontmatter = text => text.replace(/^---\n[\s\S]*?\n---\n\n?/, '');
const sourceURL = source => `https://github.com/cursor/plugins/blob/${manifest.revision}/${source}`;

function destination(source) {
  const match = source.match(/^pstack\/skills\/([^/]+)\/(.*)$/);
  if (!match) return null;
  const [, name, suffix] = match;
  if (primary.has(name)) return `skills/${name}/${suffix}`;
  if (dependency.has(name)) return `skills/architect/references/pstack/${name}/${suffix === 'SKILL.md' ? 'workflow.md' : suffix}`;
  return null;
}

function relative(from, to) {
  return path.posix.relative(path.posix.dirname(from), to) || '.';
}

function adapt(text, source, output) {
  text = text.replaceAll('.cursor/skills/', '.agents/skills/');
  text = text.replace(/\[([^\]]*)\]\((<?)([^\s)>]+)>?\)/g, (whole, label, angle, target) => {
    if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('#')) return whole;
    const [file, anchor] = target.split('#', 2);
    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(source), file));
    const mapped = destination(resolved);
    const link = mapped ? relative(output, mapped) : sourceURL(resolved);
    return `[${label}](${link}${anchor ? `#${anchor}` : ''})`;
  });
  for (const name of dependency) {
    const short = name.replace(/^principle-/, '');
    for (const label of new Set([name, short])) {
      text = text.replaceAll(`**${label}**`, `[${label}](${relative(output, destination(`pstack/skills/${name}/SKILL.md`))})`);
    }
  }
  text = text.replaceAll('**poteto-mode**', `[poteto-mode Subagents](${relative(output, 'skills/architect/references/pstack/subagents.md')})`);
  return text;
}

const license = await fs.readFile(path.join(sourceRoot, 'pstack/LICENSE'), 'utf8');
for (const [source, expectedHash] of Object.entries(manifest.files)) {
  const content = await fs.readFile(path.join(sourceRoot, source), 'utf8');
  if (sha256(content) !== expectedHash) throw new Error(`Upstream source differs from the reviewed pin: ${source}`);
  const output = destination(source);
  if (!output) continue;
  const isEntrypoint = manifest.skills.some(name => source === `pstack/skills/${name}/SKILL.md`);
  if (isEntrypoint) {
    const end = content.indexOf('\n---\n', 4);
    if (!content.startsWith('---\n') || end < 0) throw new Error(`Missing frontmatter: ${source}`);
    const metadata = content.slice(4, end).replace(/^disable-model-invocation: true\n?/m, '').trimEnd();
    const name = source.split('/')[2];
    outputs.set(output, `---\n${metadata}\nlicense: MIT\n---\n\nRead [Codex compatibility](references/codex.md) before following this workflow.\n\n${adapt(stripFrontmatter(content), source, output).trim()}\n`);
    outputs.set(`skills/${name}/agents/openai.yaml`, 'policy:\n  allow_implicit_invocation: false\n');
    outputs.set(`skills/${name}/LICENSE`, license);
    let compatibility = await fs.readFile(path.join(root, 'compatibility.md'), 'utf8');
    compatibility += `\nUpstream: [${name}](${sourceURL(source)}), revision \`${manifest.revision}\`. See [LICENSE](../LICENSE).\n`;
    if (name === 'architect') {
      compatibility += '\n## Included dependency workflows\n\n';
      for (const dep of manifest.dependencies) {
        compatibility += `- [${dep}](pstack/${dep}/workflow.md)\n`;
      }
      compatibility += '\n- [poteto-mode Subagents section](pstack/subagents.md)\n';
    }
    outputs.set(`skills/${name}/references/codex.md`, compatibility);
  } else {
    outputs.set(output, adapt(source.endsWith('/SKILL.md') ? stripFrontmatter(content) : content, source, output));
  }
}

const poteto = await fs.readFile(path.join(sourceRoot, 'pstack/skills/poteto-mode/SKILL.md'), 'utf8');
const start = poteto.indexOf('## Subagents\n');
if (start < 0) throw new Error('Upstream Subagents section moved; review compatibility before rebuilding');
const end = poteto.indexOf('\n## ', start + 1);
outputs.set('skills/architect/references/pstack/subagents.md', poteto.slice(start, end < 0 ? undefined : end).trim() + '\n');

const differences = [];
for (const [name, expected] of outputs) {
  const target = path.join(root, name);
  const actual = await fs.readFile(target, 'utf8').catch(error => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  if (actual === expected) continue;
  if (check) differences.push(name);
  else {
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, expected);
  }
}
if (check && differences.length) throw new Error(`Generated files differ: ${differences.join(', ')}`);
console.log(`${check ? 'Verified' : 'Built'} ${manifest.skills.length} skills from ${manifest.revision.slice(0, 7)} (${outputs.size} files).`);
