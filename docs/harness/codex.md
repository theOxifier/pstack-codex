# pstack in Codex

Pstack is the complete plugin at this repository's root. `<pstack>` means the folder holding
`plugin.json`, `skills/`, `agents/`, and `docs/`. Read this adapter once per session when using
Pstack in Codex. Follow the original workflows, translating only the host names below.

## Skills and tools

| Cursor | Codex |
| --- | --- |
| Run another Pstack skill (`/name` or "the **name** skill") | Read `<pstack>/skills/<name>/SKILL.md` and follow it. Principle short names resolve to `skills/principle-<name>/SKILL.md`. All skills and playbooks are included. Use the installed skill picker or `$` mention when asking the user to invoke a skill. |
| `Task`, `generalPurpose` | Use the available Codex collaboration tools and a role matching the task. Pass only supported tool fields. |
| `poteto-agent` | Use an execution-capable Codex agent with a brief requiring it to read `<pstack>/agents/poteto-agent.md` and the full `<pstack>/skills/poteto-mode/SKILL.md` before work. Pass those absolute paths. The parent owns the playbook; the delegate does not run it. |
| `comment-sicko` | Give a Codex agent `<pstack>/agents/comment-sicko.md` as its role instructions and the scoped diff/files. Preserve its report-only scope. |
| `AskQuestion` | Use an available Codex structured-question tool; otherwise ask in plain text. |
| Open a todolist, `TodoWrite` | Use available planning tools, or maintain the workflow's checklist in the conversation. |
| `Read`, `Grep`, `Glob`, shell tools | Use available file/shell tools and `rg`. |
| Cursor's built-in `create-skill` | Use Codex's `skill-creator`. |

## Subagent fields and isolation

| Cursor | Codex |
| --- | --- |
| A fresh `Task` | Use the tool schema's fresh-context option: on this host, `spawn_agent` takes `fork_turns: "none"`. Supply only the task, grounding, role/reference paths, and output location the workflow calls for. Inheriting parent history leaks arena's private rubric and earlier candidate findings; if the host cannot isolate that context, report the limitation instead of claiming a blind candidate run. |
| `run_in_background: true` | Native Codex subagents run asynchronously. Use native completion/wait tools. |
| `readonly: true` or `readonly: false` | Preserve the role's allowed effects in its brief. Investigators may read source and available connectors but must not write. Cursor's readonly/Ask-mode restriction on MCP access does not apply to Codex. |
| `environment: "cloud"` | Use an available isolated execution environment. A local worktree separates files/branches, but is not a cloud VM; disclose that substitution. If a step specifically requires a VM, remote runtime, or unavailable service, report that limitation. |
| `environment: "local"` | Use the current host only where it supplies the requested access. |
| `cloud_base_branch` | Give the isolated worker the exact starting branch/commit and verify it before work. |
| `file_attachments` | Supply absolute file pointers in the brief. |
| `resume` | Use native follow-up tools only in the cases permitted by Pstack's fresh-subagent rule. |

Batch fan-out within available concurrency without dropping candidates or feature coverage. Give
writing workers distinct worktrees/output paths and explicit ownership. Native subagents inherit
the host's permissions; a role brief does not create a separate operating-system sandbox.

## Models and setup-pstack

Cursor model slugs are not Codex model identifiers. Use only models and reasoning settings that
the current Codex tool schema or an authorized native model listing confirms are available.
`inherit-parent` and `auto` mean omit the model override. When no native mapping exists for a
Cursor default, inherit the parent and disclose the loss of model-family diversity. Preserve
panel entry counts: two inherited entries still mean two independent candidates. Do not call
same-family candidates different families. Follow arena's existing skip-and-report path when
no cross-family judge can run. Drop unsupported speed settings and say so.

Map the `pstack-models.mdc` rule and `~/.cursor/rules/pstack-models.mdc` to
`~/.agents/pstack-models.md`. This is a Pstack preference document, not a native Codex config
file. Read it when present before resolving roles; Codex does not automatically load it.

When `$setup-pstack` is requested, follow its budget, role-table, validation, and confirmation
steps. Detect native model/reasoning choices instead of Cursor slugs. Represent real role values
as `<model> <reasoning-effort>` and aliases as `inherit-parent` or `auto`; map those two fields to
the supported spawn arguments. Apply budget changes only to confirmed supported effort levels.
Map unavailable defaults to `inherit-parent`, keeping each original panel's length. After the
user confirms the choices, write the same role labels and budget comment to
`~/.agents/pstack-models.md` without Cursor YAML frontmatter. Do not put the preferences in
`AGENTS.md` or modify native/global configuration. Future Pstack invocations explicitly read
that file, so setup's claim about an always-applied Cursor rule becomes that explicit read.

## Paths and session evidence

| Cursor | Codex |
| --- | --- |
| `.cursor/skills/`, `~/.cursor/skills/` | `.agents/skills/`, `~/.agents/skills/` when creating or updating project/personal skills. The Pstack plugin itself stays in its installed plugin directory. |
| `~/.cursor/plugins/`, `.cursor-plugin/plugin.json` | Locate this Pstack plugin through the current skill's absolute path or the host-provided plugin location. Its portable manifest is `<pstack>/plugin.json`. Do not scan Cursor installations to find Codex's copy. |
| Other `.cursor/rules/*.mdc` or always-applied rules | Use the relevant project instruction mechanism only when the task requests that rule. Model preferences use the explicit-read document above. |
| Active workspace `agent-transcripts/`, `~/.cursor/projects/<slug>/...` | Use the current conversation/session record exposed by the Codex host. A host-provided transcript path or scoped chat-reading tool is valid. If unavailable, disclose the missing evidence and follow the workflow's blocked/limited-evidence path. Never scan unrelated chats or fabricate transcripts. |
| Cursor's `mcps/` discovery directory | Discover the connectors and read tools actually available in this session. |
| Pstack GitHub file URLs | Prefer the corresponding `<pstack>/<path>` when present. Keep source URLs for attribution or links to the user. |

Relative references in a skill, playbook, or agent file resolve from that file's directory.
Keep the complete plugin together: copying isolated skill folders omits shared adapters and
other workflows. The native portable manifest already discovers the canonical `skills/` tree.

## Host-only capabilities and external dependencies

Use the existing forge commands for PRs and review threads. Bugbot comments are ordinary review
evidence; starting or configuring Bugbot requires that service to be available. `cursor-team-kit`
control/deslop skills and other external plugins are not bundled by Pstack. Use an installed
equivalent when available and authorized; report a missing dependency instead of inventing it.

Cursor Automations, `api2.cursor.sh/automations` webhooks, `update_state` routine calls,
`SendToUser` secret requests, and Cursor cloud-agent dashboards are not native Codex services.
Use an available Codex scheduling/wakeup tool for `/loop` or automation only when it preserves
the requested action, timing/event behavior, and authorization. Otherwise report the unsupported
step. Do not provision a substitute service, weaken isolation, or silently claim the step ran.
When an unavailable capability is required for the deliverable, report the blocked portion;
skip only where the upstream workflow permits a skip. Keep all workflows in the repository.

## Native invocation metadata

The original frontmatter is retained. Codex's loader accepts the extra Cursor fields but does
not use `disable-model-invocation` for its invocation policy. Each upstream explicit-only skill
therefore adds `agents/openai.yaml` with `policy.allow_implicit_invocation: false`.
`setup-pstack`, which has no upstream disable flag, retains Codex's default implicit behavior.
Cursor presentation fields (`icon`, `color`) and file hints (`paths`) remain upstream annotations;
this port does not claim they provide native Codex UI styling or glob-based activation.
