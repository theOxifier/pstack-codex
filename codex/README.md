# pstack-codex

A personal Codex port of five [pstack](https://github.com/cursor/plugins/tree/bb68f2365eceafa0cb2d253112f675acf5f144cc/pstack)
skills, pinned to `bb68f2365eceafa0cb2d253112f675acf5f144cc`, November 4, 2026.
This is a Pstack-only [repository](https://github.com/theOxifier/pstack-codex). Pstack lives
in [`cursor/plugins`](https://github.com/cursor/plugins), so its directory history is extracted
with `git subtree split --prefix=pstack`. Unrelated plugins are excluded from both the tracked
tree and the published history. Original Pstack authors, dates, messages, and relevant ancestry
are retained; commit IDs change because their trees exclude the rest of the monorepo.
Codex-specific files live in `codex/`; upstream Pstack files remain unchanged at the root.
This is independent of GitHub's fork network.

- `correct`
- `architect`
- `benchmark-checklist`
- `create-verification-skill`
- `maintain-verification-skill`

This repository is independent of Enforce. It contains no Enforce drivers, model policy,
deployment configuration, or service credentials. Existing project skills are not removed.

## What differs from upstream

The root [`../skills/`](../skills/) and other Pstack files are unmodified upstream sources,
checked against SHA-256 hashes in [upstream.json](upstream.json). [compatibility.md](compatibility.md) is the Codex adapter.
[scripts/build.mjs](scripts/build.mjs) generates `skills/` by translating metadata, project-skill
paths, and dependency links. The workflow bodies are otherwise upstream text.

Supporting workflows and principles stay inside architect's references. They are not registered
as extra global skills. The original license and source attribution ship with each skill.
The full poteto-mode router, cloud agents, and swarm command are not imported.

## Review the Codex changes

The initial port history separates file movement from content changes:

1. `refactor: relocate original pstack files for Codex history` moves the reviewed upstream
   files to their Codex destinations without changing their contents. Git detects these as
   exact renames, including dependency `SKILL.md` files renamed to `workflow.md`.
2. `chore: retain upstream sources alongside the Codex port` restores the untouched upstream
   paths and adds the per-skill license copies. This keeps the original plugin tree available
   for updates and the generator.
3. `feat: apply minimal Codex compatibility changes` contains the actual adaptations and the
   new Codex configuration, documentation, and scripts.

Open the third commit on GitHub to review compatibility changes as ordinary modifications.
For one file's upstream history, follow its rename locally:

```sh
git log --follow -p -- codex/skills/correct/SKILL.md
```

For any generated workflow, the third commit's parent contains its unmodified upstream text,
so a diff against that parent shows only the Codex changes. The bundled Subagents reference
starts with the complete upstream `poteto-mode/SKILL.md`; its diff shows the extraction of the
included section. The generator continues to control the final generated contents.

A comparison of the final branch directly against `main` still shows added Codex files because
the upstream originals remain present. Git detects renames between snapshots; it does not store
a permanent rename flag. Use the separate commits to distinguish movement, copies, and edits.

## Check the fork

Requires Node.js 20 or newer. There are no package dependencies to install.

```sh
node codex/scripts/build.mjs --check
```

Run commands from the repository root. Do not edit generated `codex/skills/` files.
Generation stops if an upstream source hash no longer matches the reviewed pin. This fork does
not maintain a test suite; use build, reference, and skill metadata checks.

## Branches and upstream updates

- `origin`: `https://github.com/theOxifier/pstack-codex.git`, the Pstack-only repository.
- `upstream`: `https://github.com/cursor/plugins.git`, fetched only to extract `pstack/`.
- `main`: the extracted upstream Pstack branch, with no Codex adaptations.
- `seanrea93/codex`: the default branch containing the Codex port.
- `codex/upstream.json`: `revision` is the original monorepo commit; `history_revision` is
  the corresponding extracted Pstack commit. Source paths keep their original `pstack/` prefix
  for attribution and are read relative to the root after removing that prefix.

The earlier full monorepo fork is retained separately as `theOxifier/pstack-codex-full-fork`.
Local backup branches also preserve the earlier work. Do not publish those full-history branches
to this focused repository.

To prepare an upstream update with a clean working tree:

```sh
git fetch upstream main
git subtree split --quiet --prefix=pstack upstream/main
# Copy the printed Pstack-only commit hash into the next command.
git switch main
git merge --ff-only <pstack-only-commit>
git push origin main
git switch seanrea93/codex
git switch -c seanrea93/update-pstack-YYYY-MM-DD
git merge --no-ff --no-commit main
```

Never merge `upstream/main` directly into the port. The split is deterministic: running it
again for later upstream commits retains the same extracted history and provides a shared
merge base. Fetching upstream locally stores its objects in `.git`, but only the split `main`
and Codex branch are pushed. Avoid `git push --mirror` or `git push --all`.

Inspect the upstream changes before committing. Compare the existing `history_revision` to `main`,
especially `skills/` and any dependencies referenced by the five skills. If selected sources
changed, review the workflow differences and any necessary Codex translations, set
`previous_revision` to the old pin, and update `revision` and the existing file hashes in
`codex/upstream.json` to the reviewed original commit. Set `history_revision` to the extracted
commit. Do not add skills simply because upstream added them.
If selected sources are unchanged, the existing pin remains valid.

Regenerate and check:

```sh
node codex/scripts/build.mjs
node codex/scripts/build.mjs --check
git diff --check
git diff HEAD -- codex/
```

Inspect local reference targets and the five `agents/openai.yaml` files, then commit and push
the update branch. Review its pull request against `seanrea93/codex`. When a merge is requested,
squash-merge it and delete the remote update branch. Keep upstream changes unmodified; fix
compatibility in the Codex adapter or generator. Only extracted Pstack changes enter this repository. Only the five selected skills are
generated and eligible for opt-in installation.

## Optional global installation

Nothing is installed automatically. Preview the five links with:

```sh
node codex/scripts/install.mjs
```

When you choose to install:

```sh
node codex/scripts/install.mjs --apply
```

This links the selected directories into `~/.agents/skills`, the documented Codex user skill
location. Existing skills are never replaced; any collision stops the whole preflight before
installation. Running the command again leaves links already owned by this checkout alone.
The links follow this checkout, so keep it in place and review updates before rebuilding.

For an isolated trial or a different supported skill location:

```sh
node codex/scripts/install.mjs --dest /path/to/your/skills
node codex/scripts/install.mjs --dest /path/to/your/skills --apply
```

Invoke with `$correct`, `$architect`, `$benchmark-checklist`, `$create-verification-skill`, or
`$maintain-verification-skill`. The upstream explicit-only invocation policy is preserved.
Codex detects skill changes automatically; restart it if a new skill is not shown.

Project and user skills with the same name can both appear. This installer does not delete or
disable the old Enforce copies; retire those separately when you decide to use the personal port.

Codex references: [skill locations and symlinks](https://learn.chatgpt.com/docs/build-skills#where-to-save-skills),
[invocation policy](https://learn.chatgpt.com/docs/build-skills#optional-metadata).

## License

The upstream license and Lauren Tan's copyright notice are preserved in [LICENSE](LICENSE).

Acronym key: SHA-256 means Secure Hash Algorithm with a 256-bit digest.
