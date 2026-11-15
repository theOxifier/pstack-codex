# Codex compatibility

This is the complete Pstack plugin adapted in place. `skills/` is the only skill tree.
All upstream skills, including `poteto-mode`, `swarm`, setup, principles, playbooks, scripts,
and references remain available under their original names and paths.

The only runtime translations are in [the Codex adapter](docs/harness/codex.md), following
Pstack's existing [Claude Code adapter](docs/harness/claude-code.md) pattern:

- Host-coupled entrypoints add one adapter-reading paragraph after their H1. Their original
  workflow text, metadata, and relative links remain unchanged. Supporting files are unchanged.
- The 57 upstream explicit-only skills add native `agents/openai.yaml` policy files. The
  original Cursor flag is preserved; `setup-pstack` keeps its upstream automatic behavior.
- Cursor tool fields, custom agent roles, model/effort choices, session evidence, and skill
  paths map to available Codex equivalents. Fresh Task agents use `fork_turns: "none"` so
  arena candidates do not inherit the parent's private rubric or earlier findings.
- Setup's Cursor model rule becomes `~/.agents/pstack-models.md`, explicitly read by Pstack
  workflows. It is written only when setup is invoked and the user confirms the role table.
- Unsupported native services and missing external companion skills are reported according
  to the upstream workflow's skip/blocked rules. They are not replaced with invented services.

The root portable `plugin.json` already packages the complete tree for Codex; no additional
Codex manifest, build generator, mirrored directory, or five-skill installer is needed. The existing
Cursor manifest and upstream attribution/license are preserved. Installation stays opt-in.

`upstream.json` pins the original monorepo revision and Pstack-only history revision. `main`
contains that extracted source history. Review with `git diff main -- skills/ agents/ docs/`
and use `git log --follow -p -- skills/<name>/SKILL.md` for a skill's original history.
When updating, fetch `cursor/plugins`, extract `pstack/` with `git subtree split`, and merge
the extracted history only. Never merge the whole monorepo into this repository.

The native loader check used an isolated, network-disabled Codex profile. All 58 original
skill files loaded unchanged; native true/false invocation-policy files changed the implicit
prompt catalog as expected. Those checks do not establish that every workflow or unavailable
external service has been exercised end to end.
