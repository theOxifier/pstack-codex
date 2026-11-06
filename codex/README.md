# pstack-codex

A personal Codex port of five [pstack](https://github.com/cursor/plugins/tree/bb68f2365eceafa0cb2d253112f675acf5f144cc/pstack)
skills, pinned to `bb68f2365eceafa0cb2d253112f675acf5f144cc`, November 4, 2026.
This repository is a [GitHub fork](https://github.com/theOxifier/pstack-codex) of
[`cursor/plugins`](https://github.com/cursor/plugins), where pstack is a subdirectory.
The full upstream tree and commit history are retained so updates have shared ancestry.
Codex-specific files live in `codex/`; upstream files remain unchanged.

- `correct`
- `architect`
- `benchmark-checklist`
- `create-verification-skill`
- `maintain-verification-skill`

This repository is independent of Enforce. It contains no Enforce drivers, model policy,
deployment configuration, or service credentials. Existing project skills are not removed.

## What differs from upstream

The files in [`../pstack/`](../pstack/) are unmodified upstream sources, checked against SHA-256
hashes in [upstream.json](upstream.json). [compatibility.md](compatibility.md) is the Codex adapter.
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

- `origin`: `https://github.com/theOxifier/pstack-codex.git`, the personal fork.
- `upstream`: `https://github.com/cursor/plugins.git`, the source repository.
- `main`: unchanged upstream branch, with no Codex adaptations.
- `seanrea93/codex`: the fork's default branch, containing the Codex port.
- `seanrea93/standalone-baseline`: local backup of the original standalone repository at `b7eca95`.

To prepare an upstream update with a clean working tree:

```sh
git fetch upstream
git switch main
git merge --ff-only upstream/main
git push origin main
git switch seanrea93/codex
git switch -c seanrea93/update-pstack-YYYY-MM-DD
git merge --no-ff --no-commit upstream/main
```

Inspect the upstream changes before committing. Compare the existing pin to `upstream/main`,
especially `pstack/` and any dependencies referenced by the five skills. If selected sources
changed, review the workflow differences and any necessary Codex translations, set
`previous_revision` to the old pin, and update `revision` and the existing file hashes in
`codex/upstream.json` to the reviewed commit. Do not add skills simply because upstream added them.
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
compatibility in the Codex adapter or generator. A full upstream merge imports all plugin
sources, but only the five selected skills are generated and eligible for opt-in installation.

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
