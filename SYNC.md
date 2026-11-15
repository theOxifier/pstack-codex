# Syncing upstream

`UPSTREAM_SYNC` is the last synced monorepo commit. `upstream.json` records the original extracted-history baseline. The repository root corresponds to `cursor/plugins/pstack/`.

1. Fetch cursor/plugins and inspect `git log <last-sha>..<new-sha> -- pstack/`. Start a branch from the Codex port.
2. Replay each pstack-only change in order: apply its `git diff <sha>^ <sha> -- pstack/` with the `pstack/` prefix stripped, preserving the upstream author, author date and full commit message. Do not merge the monorepo. Move deleted files to Trash.
3. Reconcile the changes with `compatibility.md` and `docs/harness/codex.md`, including adapter pointers and invocation metadata. Check retired roles, links and native model mapping. Update the marker and this guidance if needed.
4. Run the available upstream checks and inspect the diff against the upstream tree and Codex adaptations. Commit sync metadata separately and open a pull request.
