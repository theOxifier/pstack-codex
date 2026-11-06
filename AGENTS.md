# pstack-codex

Keep this fork as close to pstack as possible. Change upstream behavior only when Codex
compatibility requires it; document each translation in `codex/compatibility.md`.

- This is a Git fork of `cursor/plugins`; `main` follows upstream, and `seanrea93/codex`
  contains the Codex port. Keep upstream files, including `pstack/`, unmodified.
- `codex/skills/` is generated. Change `codex/compatibility.md` or `codex/scripts/build.mjs`,
  not generated files. `codex/upstream.json` pins the reviewed source revision and hashes.
- `codex/scripts/` uses Node's built-in modules; do not add dependencies without a demonstrated need.
- Do not add test suites for this fork. Validate generated output with
  `node codex/scripts/build.mjs --check`, reference inspection, and skill metadata validation.
- Installation is opt-in. Never overwrite existing user skills or alter another project's skills.
- Preserve upstream attribution and licenses. Do not import Enforce-specific commands or policies.
- See `codex/README.md` for the upstream update workflow. Do not expand the five installed skills
  when updating the full upstream repository.
