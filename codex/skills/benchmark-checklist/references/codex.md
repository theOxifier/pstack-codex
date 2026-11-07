# Codex compatibility

Follow the upstream workflow below, translating only its host-specific instructions:

- Invoke a skill with `$name`. Upstream `/name` mentions refer to that skill or to an included
  dependency workflow. This fork preserves upstream explicit-only invocation through
  `agents/openai.yaml`, not Cursor's `disable-model-invocation` frontmatter.
- Use Codex collaboration tools for upstream `Task`, `generalPurpose`, `run_in_background`,
  and wait instructions. Match the requested role and allowed actions, not unsupported tool fields.
  Batch work within available concurrency. If agents are unavailable, report the missing work.
- For fresh Task subagents using `spawn_agent`, set `fork_turns: "none"` and pass only the prompt
  and file pointers the upstream workflow specifies. Inherited parent history would expose
  arena's private rubric and earlier candidate findings.
- Do not look for `pstack-models.mdc` or request Cursor-only model names. Use available Codex
  models or inherit the parent model; disclose lost model diversity. Never claim that independent
  same-family agents are different model families. If arena's cross-family judge cannot run,
  follow its documented skip-and-report path. Choose supported reasoning settings for the task.
- `readonly` describes allowed effects. Give investigators source and connector reads without
  permission to change data; Codex does not need Cursor's Ask/agent-mode toggle to expose tools.
  Discover connectors from the tools actually available, not a Cursor-specific `mcps/` directory.
- Use available planning tools or a short checklist for TodoWrite/todolist. Use `rg --files`,
  `rg`, and file reads for Glob, Grep, and Read.
- Generated project skills live in `.agents/skills`, rather than `.cursor/skills`.
- The architect dependency workflows and principles are included as local references, not extra
  globally installed skills. Follow linked workflows as part of architect. Inline relative paths
  in a dependency resolve from that dependency's own directory.
- References to poteto-mode's Subagents section refer only to the included section, not its
  routing system. This fork does not install poteto-mode, cloud agents, or a swarm command.

Generation changes entrypoint metadata only by removing Cursor's `disable-model-invocation`.
Its explicit-only behavior moves to `agents/openai.yaml`; all other upstream metadata is kept.
Dependency references retain their original frontmatter and are named `workflow.md` so they
are not additional skill entrypoints. Each installed skill includes the upstream LICENSE.
Only architect needs a compatibility preamble for its Cursor tools, models, and dependencies;
the other entrypoints need only metadata and project-skill path translations.
Local Markdown links are rewritten only when relocation changes their target; links outside
the bundled files point to the pinned upstream source. Bold dependency names become links
to the bundled workflows. The Subagents reference contains that upstream section verbatim.

No project-specific testing rules, model pins, service commands, or reporting formats are added.
The actual workflow bodies remain upstream text apart from paths and local dependency links.

Upstream: [benchmark-checklist](https://github.com/cursor/plugins/blob/bb68f2365eceafa0cb2d253112f675acf5f144cc/pstack/skills/benchmark-checklist/SKILL.md), revision `bb68f2365eceafa0cb2d253112f675acf5f144cc`. See [LICENSE](../LICENSE).
