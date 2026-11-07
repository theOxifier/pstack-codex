# pstack-codex

Keep this port as close to pstack as possible. Change upstream behavior only when Codex
compatibility requires it; document each translation in `codex/compatibility.md`.

- This repository contains only Pstack and its Codex adapter. `main` follows the Pstack-only
  history extracted from `cursor/plugins`; `seanrea93/codex` contains the port.
- Upstream Pstack files at the repository root, including `skills/`, remain unmodified.
- `codex/skills/` is generated. Change `codex/compatibility.md` or `codex/scripts/build.mjs`,
  not generated files. `codex/upstream.json` pins the original revision, source hashes, and
  extracted history revision. Manifest paths retain the original `pstack/` prefix.
- `codex/scripts/` uses Node's built-in modules; do not add dependencies without a demonstrated need.
- Do not add test suites for this port. Validate with `node codex/scripts/build.mjs --check`,
  reference inspection, and skill metadata validation. Requested skill trials use disposable
  projects outside this repository and do not add a maintained test suite.
- Installation is opt-in. Never overwrite existing user skills or alter another project's skills.
- Preserve upstream attribution and licenses. Do not import Enforce-specific commands or policies.
- See `codex/README.md` for upstream updates. Never merge the full `cursor/plugins` branch
  into this repository; split `pstack/` first. Keep the five installed skills unchanged in scope.
