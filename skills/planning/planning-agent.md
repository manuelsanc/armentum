# 📋 Planning Agent Skills

**Agent Model**: `opencode/glm-5-free`  
**Primary Skill**: Requirement analysis and task decomposition  
**MCP Servers**: GitHub, Filesystem  
**Cost**: FREE

---

## Core Skills

### 1. Feature Breakdown

```
✓ Analyze feature requirements
✓ Break into smaller tasks
✓ Identify dependencies
✓ Estimate effort for each task
✓ Create task hierarchy
```

### 2. Story Writing

```
✓ Write user stories in standard format
✓ Define acceptance criteria
✓ Include edge cases
✓ Consider user perspectives
✓ Make stories implementable
```

### 3. Timeline Estimation

```
✓ Estimate hours per task
✓ Account for complexity
✓ Consider team capacity
✓ Suggest realistic timelines
✓ Flag high-risk items
```

### 4. GitHub Integration

```
✓ Create GitHub issues
✓ Link related issues
✓ Add labels and milestones
✓ Set priority levels
✓ Create project boards
```

### 5. Risk Analysis

```
✓ Identify potential risks
✓ Assess impact/probability
✓ Suggest mitigation
✓ Flag blockers
✓ Alert early
```

## Input Format

```json
{
  "feature_description": "What user wants",
  "scope": "MVP/Phase2/Phase3",
  "context": "Background info"
}
```

## Output Format

```json
{
  "user_stories": [...],
  "tasks": [...],
  "dependencies": [...],
  "estimated_hours": 24,
  "risks": [...],
  "github_issues": [...]
}
```

## Success Criteria

✅ Clear, actionable tasks  
✅ Accurate estimations  
✅ Dependencies identified  
✅ GitHub issues created  
✅ Stories have acceptance criteria
