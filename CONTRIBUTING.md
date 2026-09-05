# Branching Strategy

Four long-lived branches map to environments, plus short-lived feature/hotfix branches. Changes are promoted through the chain via pull request — nothing is pushed directly to `release`, `uat`, or `production`.

```
feature/TICKET-123-desc ──PR──> development ──PR──> release ──PR──> uat ──PR──> production
                    └──────────────PR (when needed)───────^
hotfix/TICKET-999 ────────────────────────────────────────────PR──> production
                                                                        │
                                                          back-merge into uat, release, development
```

## Branches

| Branch | Maps to | Fed by | Who approves the merge |
|---|---|---|---|
| `development` | Dev environment | `feature/*` PRs | Any team member |
| `release` | Pre-UAT staging | PRs from `development`, or a `feature/*` branch directly when a ticket needs to skip general integration | Any team member |
| `uat` | UAT environment | PRs from `release` only | **Repo owner only** |
| `production` | Production | PRs from `uat`, or a `hotfix/*` branch | **Repo owner only** |

`uat` and `production` are control points — every merge into them needs the repo owner's approval. `development` and `release` stay lightweight so day-to-day work isn't blocked.

## Branch naming

- `feature/<TICKET-ID>-<short-slug>` — e.g. `feature/BLOG-123-add-comments`
- `hotfix/<TICKET-ID>-<short-slug>` — branched from `production` for urgent fixes

## Hotfixes

Branch `hotfix/<TICKET-ID>` off `production`, PR straight back into `production` (owner-approved). Once merged, back-merge the same commit into `uat`, `release`, and `development` so they don't drift out of sync.

## Releases and rollback

- Squash-merge promotion PRs (`release`→`uat`, `uat`→`production`) so each promotion is a single, easily revertable commit.
- Tag every merge into `production` (e.g. `v1.4.0`). To roll back, deploy the previous tag rather than digging through history.

## GitHub branch protection (configure in Settings → Branches)

**`uat` and `production`:**
- Require a pull request before merging (no direct pushes).
- Restrict who can push to matching branches → repo owner only. This is what actually enforces owner-only merges — anyone can review, but only the owner can click merge.
- Require branches to be up to date before merging.

**`development` and `release`:**
- Require a pull request before merging; review from any team member is sufficient.
