# pstack-codex

Keep this port as close to Pstack as possible. Change upstream behavior only when Codex
compatibility requires it; document each translation in `compatibility.md`.

- `skills/` is the complete canonical Pstack skill tree, including `poteto-mode`, principles,
  references, scripts, and playbooks. Adapt it in place. Do not create a generated copy,
  a selected-skill allowlist, or a separate `codex/skills/` package.
- `main` follows Pstack-only history extracted from `cursor/plugins`. `upstream.json` records
  the original monorepo revision and extracted history revision. Never merge the full
  `cursor/plugins` branch into this repository; split `pstack/` first.
- Keep workflow bodies and supporting files upstream text. Put host translations in
  `docs/harness/codex.md`; add only necessary adapter pointers and native invocation metadata.
- `plugin.json` already packages the canonical `skills/` tree. Installation is opt-in.
  Never overwrite existing user skills or change another project's skills or global setup.
- Do not add a test suite for this port. Validate through the upstream diff, reference
  inspection, skill metadata, and native loader checks. Requested behavioral trials use
  disposable projects outside this repository.
- Any added scripts must use Node's built-in modules unless a dependency is demonstrably needed.
- Preserve upstream attribution and licenses. Do not import Enforce-specific commands or policies.
