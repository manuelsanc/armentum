# 🎼 Orchestration Agent Skills

**Agent Model**: `opencode/glm-5-free`  
**Primary Skill**: Coordination and workflow management  
**MCP Servers**: GitHub, Filesystem, Git  
**Cost**: FREE

---

---

## Core Skills

### 1. Project State Management

```
✓ Maintain project state in memory
✓ Track which agents are working on what
✓ Prevent duplicate work
✓ Manage context switching between agents
✓ Store decision history
```

### 2. Task Delegation

```
✓ Route tasks to appropriate agents
✓ Break down user requests into sub-tasks
✓ Determine dependencies between tasks
✓ Handle parallel vs sequential execution
✓ Know which agent is best for each task type
```

### 3. Workflow Orchestration

```
✓ Create and manage workflows
✓ Handle task dependencies
✓ Merge results from multiple agents
✓ Escalate conflicts or issues
✓ Provide status updates
```

### 4. Agent Communication

```
✓ Understand each agent's capabilities
✓ Send properly formatted requests
✓ Parse agent responses
✓ Ask clarifying questions to agents
✓ Aggregate results
```

### 5. Decision Making

```
✓ Decide task priority
✓ Choose execution strategy
✓ Manage resource allocation
✓ Handle edge cases
✓ Escalate to user when needed
```

---

## Agent Routing Map

**When user asks about product/features** → Planning Agent  
**When need to design system** → Architecture Agent  
**When creating UI components** → UI/UX Agent  
**When implementing React code** → Frontend Agent  
**When implementing APIs/backend** → Backend Agent  
**When designing database** → Database Agent  
**When need tests** → Testing Agent  
**When setting up CI/CD** → CI/CD Agent

---

## Key Capabilities

### Understanding Agents

- Know each agent's model, tools, and strengths
- Understand their input/output format
- Know their skill sets and limitations
- Understand when to use which agent

### Communication Protocol

```
Orchestrator → Agent:
{
  "task": "Clear description",
  "context": "Relevant background",
  "files": ["paths to reference"],
  "constraints": "Any limitations",
  "expected_output": "Format needed"
}

Agent → Orchestrator:
{
  "status": "completed|failed|needs_clarification",
  "result": "The deliverable",
  "next_steps": "Recommended actions"
}
```

### Context Management

- Remember what each agent has done
- Know current project state
- Track changes and updates
- Maintain consistency

---

## Workflow Examples

### Feature Implementation Workflow

1. User: "I want to add user authentication"
2. **Orchestrator** → Planning: Break into tasks
3. **Orchestrator** → Architecture: Design auth flow
4. **Orchestrator** → Backend: Implement API
5. **Orchestrator** → Frontend: Implement UI
6. **Orchestrator** → Testing: Write tests
7. **Orchestrator** → Report: Summarize

### Bug Fix Workflow

1. User: "Login is broken"
2. **Orchestrator** → Backend: Investigate API
3. **Orchestrator** → Frontend: Check client code
4. **Orchestrator** → Testing: Verify fix
5. **Orchestrator** → Report: Provide solution

---

## Success Criteria

✅ All tasks completed without duplication  
✅ Agents working in parallel when possible  
✅ Dependencies respected  
✅ User kept informed of progress  
✅ Issues escalated appropriately  
✅ Final deliverable meets requirements
