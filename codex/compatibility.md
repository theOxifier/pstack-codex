# Codex compatibility

Follow the upstream workflow below, translating only its host-specific instructions:

- Invoke a skill with `$name`. Upstream `/name` mentions refer to that skill or to an included
  dependency workflow. This fork preserves upstream explicit-only invocation through
  `agents/openai.yaml`, not Cursor's `disable-model-invocation` frontmatter.
- Use Codex collaboration tools for upstream `Task`, `generalPurpose`, `run_in_background`,
  and wait instructions. Match the requested role and allowed actions, not unsupported tool fields.
  Batch work within available concurrency. If agents are unavailable, report the missing work.
- Do not look for `pstack-models.mdc` or request Cursor-only model names. Use available Codex
  models or inherit the parent model; disclose lost model diversity. Never claim that independent
  same-family agents are different model families. If arena's cross-family judge cannot run,
  follow its documented skip-and-report path. Choose supported reasoning settings for the task.
- `readonly` describes allowed effects. Give investigators source and connector reads without
  permission to change data; Codex does not need Cursor's Ask/agent-mode toggle to expose tools.
  Discover connectors from the tools actually available, not a Cursor-specific `mcps/` directory.
- Use available planning tools or a short checklist for TodoWrite/todolist. Use `rg --files`,
  `rg`, and file reads for Glob, Grep, and Read. Follow host and project permissions throughout;
  design-only or checkpoint requests do not authorize implementation, publishing, or agreements.
- Generated project skills live in `.agents/skills`, rather than `.cursor/skills`.
- The architect dependency workflows and principles are included as local references, not extra
  globally installed skills. Follow linked workflows as part of architect. Inline relative paths
  in a dependency resolve from that dependency's own directory. A caller's stronger requirement
  still applies, including architect's two structurally distinct candidates before synthesis.
- References to poteto-mode's Subagents section refer only to the included section, not its
  routing system. Unbundled performance/ship playbooks mentioned for context remain optional
  upstream context; this fork does not install poteto-mode, cloud agents, or a swarm command.

No project-specific testing rules, model pins, service commands, or reporting formats are added.
The actual workflow bodies remain upstream text apart from paths and local dependency links.
