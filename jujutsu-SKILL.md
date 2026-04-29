---
description: Jujutsu (jj) version control system - Git-compatible VCS with automatic working copy commits, change IDs, and first-class conflict handling
---

# Jujutsu (jj) Skill

## Quick Reference

| Command | Purpose |
|---------|---------|
| `jj st` / `jj status` | Working copy status |
| `jj log` | Commit history with graph |
| `jj diff` | Show changes |
| `jj desc -m "msg"` | Set commit message |
| `jj ci -m "msg"` / `jj commit` | Commit and create new change |
| `jj new` | Create empty commit |
| `jj abandon <rev>` | Remove commit, rebase children |
| `jj rebase -s <src> -d <dst>` | Move commits |
| `jj bookmark create <name>` | Create bookmark (branch) |
| `jj undo` / `jj redo` | Operation log undo/redo |

## Key Concepts

### Change ID vs Commit ID
- **Change ID**: Stable identifier across rewrites (amends, rebases). Persists through `jj describe`, `jj rebase`
- **Commit ID**: Content hash. Changes when you amend or rebase

### Working Copy (`@`)
- Automatically committed - no staging area
- The `@` symbol refers to working copy commit
- `@-` = parent of working copy

### Revset Expressions
- `@` - Working copy
- `@-` - Parent
- `::@` - Ancestors of working copy
- `main..@` - Commits between main and working copy
- `root()` - Root commit
- `bookmarks()` - All bookmarked commits
- `description("foo")` - Commits with "foo" in message

### Bookmarks (Branches)
- `jj bookmark create foo` - Create at current commit
- `jj bookmark create foo -r main` - Create at specific rev
- `jj bookmark list` - Show all
- `jj bookmark delete foo` - Delete

## Common Workflows

### Start new feature
```bash
jj new main -m "Add feature X"
# edit files...
jj ci -m "Implement feature X"
```

### Amend last commit
```bash
jj desc -m "Better message"
# or edit files and:
jj ci --amend
```

### Interactive commit (split changes)
```bash
jj commit -i -m "Only some changes"
```

### Rebase onto updated main
```bash
jj rebase -s @ -d main
```

### Abandon work
```bash
jj abandon @-
```

### View operation history
```bash
jj op log          # Show operations
jj undo            # Undo last operation
jj undo --from 3   # Undo to specific op
jj redo            # Redo undone operation
```

## Git Interop (Colocated)

When in a Git repo with `.jj/`:
```bash
jj git import      # Import Git refs into jj
jj git export      # Export jj bookmarks to Git
jj git fetch       # Fetch from Git remote
jj git push        # Push to Git remote
```

## Conflicts

Conflicts are first-class - stored in commits:
```bash
jj resolve         # List conflicts
jj resolve file.rs # Resolve specific file
```

## Tips

- No `git add` - all changes auto-tracked in `@`
- Use `jj undo` liberally - full operation log
- `jj squash` combines commits
- `jj split` divides a commit interactively
- `jj obslog` shows evolution of a change
- Immutable commits protect history (configurable via `revsets.immutable-heads`)
