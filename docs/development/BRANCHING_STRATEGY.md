# Git Branching Strategy - Armentum Project

## Overview

The Armentum project uses **GitHub Flow**, a simple yet effective branching strategy optimized for:
- Continuous deployment and rapid iterations
- Clear PR-based code review process
- Easy rollback capability
- Minimal branch management overhead
- Perfect for solo developer or small teams on MVP timelines

This strategy supports incremental development with protected main branch, ensuring code quality through reviews before production deployment.

---

## Branch Structure

### Main Branches

#### `main` (Protected)
- **Purpose**: Production-ready code only
- **Protection Rules**:
  - Requires pull request reviews (minimum 1 approval)
  - Requires status checks to pass (build, linting, tests)
  - Dismisses stale PR reviews when new commits pushed
  - Requires branches to be up-to-date before merging
- **Deployment**: Automatic to Vercel production on merge
- **Requires**: Code review and CI/CD success

#### `develop` (Optional, for staging)
- **Purpose**: Staging environment before production
- **When Used**: If you want a staging deployment before main
- **Protection Rules**: Same as main (can be more lenient during MVP)
- **Deployment**: Automatic to Vercel staging on merge
- **Note**: Not required for MVP - use main directly if simpler

### Feature/Work Branches

All development work happens in short-lived branches created from `main`.

**Branch Types and Naming Conventions**:

```
feat/*         → New features
               Example: feat/user-authentication
               Example: feat/admin-dashboard

fix/*          → Bug fixes
               Example: fix/login-form-validation
               Example: fix/corista-list-sorting

docs/*         → Documentation only
               Example: docs/api-endpoints
               Example: docs/deployment-guide

refactor/*     → Code refactoring (no new features)
               Example: refactor/extract-form-components
               Example: refactor/optimize-api-calls

style/*        → Code style changes (formatting, linting)
               Example: style/apply-prettier-rules
               Example: style/fix-eslint-warnings

test/*         → Test additions or modifications
               Example: test/add-login-tests
               Example: test/improve-coverage

chore/*        → Build, dependencies, CI/CD changes
               Example: chore/update-dependencies
               Example: chore/setup-github-actions

hotfix/*       → Critical production fixes (from main)
               Example: hotfix/security-patch
               Example: hotfix/database-connection
```

---

## Workflow: Feature Development

### Step 1: Create Feature Branch

```bash
# Update main to latest
git checkout main
git pull origin main

# Create feature branch from main
git checkout -b feat/feature-name

# Or for bugfix:
git checkout -b fix/bug-name

# Or for documentation:
git checkout -b docs/document-name
```

**Branch Naming Rules**:
- Use lowercase
- Use hyphens to separate words (kebab-case)
- Be descriptive but concise (max 50 characters)
- Start with type prefix (feat/, fix/, docs/, etc.)
- Examples:
  - ✅ `feat/user-profile-editing`
  - ✅ `fix/login-button-styling`
  - ❌ `feature/user` (too vague)
  - ❌ `FEAT/UserProfile` (wrong case)
  - ❌ `feat-user-profile-editing-with-validation-and-error-handling` (too long)

### Step 2: Make Changes

```bash
# Create meaningful commits
git add src/app/pages/Home.tsx
git commit -m "feat: extract feature cards into reusable component"

git add src/services/api.ts
git commit -m "feat: add centralized HTTP client with error handling"

# Multiple small commits are better than one giant commit
# Each commit should be atomic and logically complete
```

**Commit Message Format**:
```
[type]: [description]
[optional body]
```

**Types** (matching branch type):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `style:` - Formatting/style changes
- `test:` - Tests
- `chore:` - Build/tooling changes

**Example Commits**:
```bash
git commit -m "feat: add Zustand store for authentication

- Create authStore with login/logout actions
- Add TypeScript types for auth state
- Integrate with Login component"

git commit -m "fix: handle empty corista list gracefully"

git commit -m "docs: add API endpoint documentation"
```

### Step 3: Push and Create Pull Request

```bash
# Push feature branch to remote
git push -u origin feat/feature-name

# Create PR on GitHub (via CLI)
gh pr create --title "Add user profile editing" \
  --body "## Summary\n\nAllows users to edit their profile information."

# Or create via GitHub web interface
```

**Pull Request Template**:

```markdown
## Summary
Brief description of what this PR does.

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Refactoring

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How was this tested? 
- Manual testing steps
- Test files added

## Screenshots (if applicable)
Add before/after screenshots for UI changes.

## Checklist
- [ ] Code follows style guide (DEVELOPERS.md)
- [ ] Self-reviewed code
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Tests pass locally
- [ ] Build passes (`npm run build`)
```

### Step 4: Code Review Process

**For Solo Developer**:
1. Review your own code objectively
2. Run `npm run build` locally
3. Run `npm run lint` to catch style issues
4. Test manually in browser
5. Merge to main when satisfied

**For Team/Pair Development**:
1. Request review from team member
2. Reviewer checks:
   - Code follows DEVELOPERS.md guidelines
   - No hardcoded values or secrets
   - Tests are included
   - Commit messages are clear
   - No merge conflicts
3. Reviewer approves or requests changes
4. Squash merge to main (optional - keeps history clean)

**CI/CD Checks** (Automatic):
- Build succeeds (`npm run build`)
- Linting passes (`npm run lint`)
- Type checking passes (TypeScript strict mode)
- Tests pass (`npm run test` if configured)

### Step 5: Merge and Deploy

```bash
# Option 1: Merge via GitHub CLI
gh pr merge feat/feature-name --merge

# Option 2: Merge via GitHub web interface
# Click "Merge pull request" button

# Option 3: Squash commits (cleaner history)
gh pr merge feat/feature-name --squash
```

**After Merge**:
1. Feature branch automatically deleted on GitHub
2. Vercel automatically deploys main to production
3. Local cleanup:
   ```bash
   git checkout main
   git pull origin main
   git branch -d feat/feature-name  # Delete local branch
   ```

---

## Workflow: Hotfixes (Critical Production Issues)

For urgent production fixes:

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-name

# Make fix
git add src/app/pages/Home.tsx
git commit -m "fix: prevent crash when loading events list"

# Push and create PR
git push -u origin hotfix/critical-bug-name
gh pr create --title "URGENT: Fix crash on events page"

# Merge directly to main (skip develop if exists)
# Deploy immediately
```

---

## Protected Main Branch Rules

GitHub will enforce these rules (configure in repository settings):

### Branch Protection Settings

**Settings → Branches → main → Add rule**:

1. **Require a pull request before merging**
   - ✅ Require approvals: 1 (solo) or 2+ (team)
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require review from code owners (if CODEOWNERS file exists)

2. **Require status checks to pass before merging**
   - ✅ GitHub Actions (build)
   - ✅ GitHub Actions (linting)
   - ✅ GitHub Actions (type checking)
   - ✅ GitHub Actions (tests - when added)

3. **Require branches to be up to date before merging**
   - ✅ Enabled (prevents merge conflicts)

4. **Include administrators**
   - ❌ Disabled (allows you to force merge if critical)

5. **Restrict who can push to matching branches**
   - ❌ Optional (enforce if you have multiple developers)

---

## Local Branch Management

### View All Branches

```bash
# Local branches only
git branch

# All branches (local + remote)
git branch -a

# Branches with last commit info
git branch -vv
```

### Delete Branches

```bash
# Delete local branch (safe - only deletes if merged)
git branch -d feat/feature-name

# Force delete local branch (even if not merged - be careful!)
git branch -D feat/feature-name

# Delete remote branch
git push origin --delete feat/feature-name

# Clean up deleted remote branches
git fetch --prune
```

### Update Feature Branch from Main

```bash
# If main has new commits while you're developing
git fetch origin
git rebase origin/main

# Or merge (creates merge commit)
git merge main

# If conflicts, resolve them then:
git add .
git commit -m "Merge main into feature branch"
```

---

## Release Strategy (For Main Releases)

### Minor Release (Feature Release)

```bash
# 1. When features are complete and tested on main
# 2. Create release PR
git checkout -b release/v0.1.0
git tag -a v0.1.0 -m "Version 0.1.0 - Feature release"
git push origin release/v0.1.0 --tags

# 3. Vercel automatically deploys tagged releases
# 4. GitHub creates release page with changelog
```

### Patch Release (Bugfix Release)

```bash
# For critical bugs
git checkout main
git pull
git checkout -b hotfix/critical-issue
# ... make fix ...
git tag -a v0.1.1 -m "Version 0.1.1 - Bugfix"
git push origin main --tags
```

---

## Best Practices

### Commit Messages

✅ **DO**:
```bash
# Good - specific and actionable
git commit -m "feat: add email validation to login form"
git commit -m "fix: prevent duplicate corista entries in list"
git commit -m "docs: add setup instructions for development"
```

❌ **DON'T**:
```bash
# Bad - vague
git commit -m "Update code"
git commit -m "Fix stuff"
git commit -m "WIP"

# Bad - includes issue number in wrong place
git commit -m "Fixes #123" # Should be in PR body
```

### Branch Lifetime

- **Feature branches live for 1-3 days** (small feature)
- **Longer branches risk conflicts** (rebase frequently from main)
- **Delete branches after merge** (no branch clutter)

### Pull Request Size

- **Ideal PR size**: 200-400 lines of code changes
- **Too large**: > 1000 lines (hard to review)
- **Split large features** into multiple PRs

### Commit Frequency

- **Commit after each logical chunk** (not after every line)
- **Atomic commits** (each commit is independent)
- **Minimum 1 commit, maximum 10** per PR for MVP

### Code Review Checklist

Before approving a PR:
- [ ] Code follows DEVELOPERS.md style guide
- [ ] All functions have return type annotations
- [ ] No console.log statements (except warnings/errors)
- [ ] No hardcoded API URLs or secrets
- [ ] Tests added for new functionality
- [ ] Build passes locally
- [ ] Linting passes locally
- [ ] No merge conflicts with main
- [ ] PR description is clear and complete

---

## Example Workflows

### Workflow 1: Feature Development (Happy Path)

```bash
# Day 1: Start feature
git checkout main && git pull
git checkout -b feat/user-authentication

# Make changes
git add src/app/pages/Login.tsx
git commit -m "feat: create login page with form validation"

git add src/services/auth.ts
git commit -m "feat: add authentication service with JWT support"

git push -u origin feat/user-authentication

# Create PR on GitHub
gh pr create --title "Add user authentication" \
  --body "Implements login flow with JWT tokens"

# Day 2: Code review feedback
git add src/app/pages/Login.tsx
git commit -m "fix: improve error messages on login form"
git push

# Day 3: Merge
gh pr merge feat/user-authentication --squash
# Vercel deploys automatically

# Cleanup
git checkout main && git pull
git branch -d feat/user-authentication
```

### Workflow 2: Hotfix (Critical Bug)

```bash
# Critical bug found in production
git checkout main && git pull
git checkout -b hotfix/security-vulnerability

# Fix the bug
git add src/services/api.ts
git commit -m "fix: sanitize user input in API calls"

git push -u origin hotfix/security-vulnerability

# Quick review and merge
gh pr create --title "HOTFIX: Security vulnerability in API"
gh pr merge hotfix/security-vulnerability --merge

# Immediate deployment
# Clean up
git branch -d hotfix/security-vulnerability
```

### Workflow 3: Documentation Update

```bash
git checkout main && git pull
git checkout -b docs/api-documentation

git add docs/technical/API_SPECIFICATION.md
git commit -m "docs: add endpoint examples and authentication header"

git push -u origin docs/api-documentation
gh pr create --title "Update API documentation"
gh pr merge docs/api-documentation --merge

git checkout main && git pull
git branch -d docs/api-documentation
```

---

## Timeline for MVP (8 Weeks)

Using this branching strategy with continuous deployment:

| Week | Typical Branch Activity |
|------|------------------------|
| 1-2 | Auth, database setup (multiple feat/* branches) |
| 3-4 | Core features (feat/users, feat/events, feat/admin-panel) |
| 5-6 | Additional features (feat/notifications, feat/dashboard) |
| 7 | Bug fixes and polish (fix/*, style/* branches) |
| 8 | Final testing, hotfixes only (hotfix/* branches) |

**Tip**: Parallel development possible with different feature branches merged daily.

---

## Troubleshooting

### Problem: Branch is behind main

```bash
git fetch origin
git rebase origin/main
# Or use merge if prefer
git merge main
```

### Problem: Merge conflict

```bash
# View conflicted files
git status

# Open conflicted file and resolve manually
# Then:
git add resolved-file.tsx
git commit -m "Resolve merge conflict with main"
git push
```

### Problem: Accidentally committed to main

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1
git checkout -b feat/correct-branch
git commit -m "..."
git push -u origin feat/correct-branch
```

### Problem: Need to delete a branch

```bash
# Local deletion (safe)
git branch -d branch-name

# Force delete (use if not merged)
git branch -D branch-name

# Remote deletion
git push origin --delete branch-name
```

---

## Summary

**GitHub Flow provides**:
- ✅ Simple branching model (main + feature branches)
- ✅ Clear code review process (PRs)
- ✅ Continuous deployment ready
- ✅ Easy rollback capability
- ✅ Minimal merge conflicts
- ✅ Perfect for MVP development

**For Armentum MVP**:
- Main branch protected and production-ready
- Feature branches for all development work
- Daily or multiple merges to main
- Automatic Vercel deployment on merge
- Quick iterations and rapid feature shipping

