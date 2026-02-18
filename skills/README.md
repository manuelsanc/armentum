# 🤖 AI Agents Skills Directory

This directory contains detailed skill definitions for each AI agent in the Armentum project. Each agent has a specialized set of capabilities that enable them to work together effectively.

---

## 📁 Skills Structure

```
skills/
├── orchestration/       # Master conductor
│   └── orchestration-agent.md
├── planning/            # Feature breakdown & planning
│   └── planning-agent.md
├── architecture/        # System design
│   └── architecture-agent.md
├── ui_ux/               # Component design
│   └── ui_ux-agent.md
├── frontend/            # React implementation
│   └── frontend-agent.md
├── backend/             # FastAPI implementation
│   └── backend-agent.md
├── database/            # Database design
│   └── database-agent.md
├── testing/             # Test implementation
│   └── testing-agent.md
├── ci_cd/               # Deployment automation
│   └── ci_cd-agent.md
└── README.md            # This file
```

---

## 🤖 Agents Overview

### 1. 🎼 Orchestration Agent
**Model**: `opencode/glm-4.7-free` (FREE)  
**Role**: Master conductor of all agents  
**Skills**: Workflow management, task delegation, state management  
**Read**: [orchestration-agent.md](./orchestration/orchestration-agent.md)

### 2. 📋 Planning Agent
**Model**: `opencode/glm-4.7-free` (FREE)  
**Role**: Break down features into actionable tasks  
**Skills**: User story writing, task breakdown, risk analysis  
**Read**: [planning-agent.md](./planning/planning-agent.md)

### 3. 🏗️ Architecture Agent
**Model**: `opencode/glm-4.7-free` (FREE)  
**Role**: Design system architecture  
**Skills**: System design, API design, database planning  
**Read**: [architecture-agent.md](./architecture/architecture-agent.md)

### 4. 🎨 UI/UX Agent
**Model**: `opencode/glm-4.7-free` (FREE)  
**Role**: Convert designs to components  
**Skills**: Component design, responsive design, accessibility  
**Read**: [ui_ux-agent.md](./ui_ux/ui_ux-agent.md)

### 5. ⚛️ Frontend Agent
**Model**: `opencode/claude-haiku-4-5` ($1/$5 per 1M tokens)  
**Role**: Implement React features  
**Skills**: React development, state management, API integration  
**Read**: [frontend-agent.md](./frontend/frontend-agent.md)

### 6. 🐍 Backend Agent
**Model**: `opencode/gpt-5.1-codex-mini` ($0.25/$2 per 1M tokens)  
**Role**: Implement Python APIs  
**Skills**: FastAPI development, database operations, authentication  
**Read**: [backend-agent.md](./backend/backend-agent.md)

### 7. 🗄️ Database Agent
**Model**: `opencode/glm-4.7-free` (FREE)  
**Role**: Design and optimize database  
**Skills**: Schema design, migrations, query optimization  
**Read**: [database-agent.md](./database/database-agent.md)

### 8. 🧪 Testing Agent
**Model**: `opencode/glm-4.7-free` (FREE)  
**Role**: Implement comprehensive tests  
**Skills**: Test design, unit/integration/E2E testing, coverage  
**Read**: [testing-agent.md](./testing/testing-agent.md)

### 9. 🚀 CI/CD Agent
**Model**: `opencode/glm-4.7-free` (FREE)  
**Role**: Setup automation and deployment  
**Skills**: GitHub Actions, code quality, deployment automation  
**Read**: [ci_cd-agent.md](./ci_cd/ci_cd-agent.md)

**Estimated Monthly Cost**: $8-13 (7 free + 2 paid agents)

---

## 🔄 Agent Workflow

### Typical Feature Implementation

```
User Request
    ↓
Orchestration Agent (coordinates)
    ├→ Planning Agent (break down)
    ├→ Architecture Agent (design)
    ├→ UI/UX Agent (components)
    ├→ Frontend Agent (implement)
    ├→ Backend Agent (APIs)
    ├→ Database Agent (schema)
    ├→ Testing Agent (tests)
    └→ CI/CD Agent (deploy)
    ↓
Deliver to User
```

---

## 📖 How to Use

### For Each Agent's Skills

1. **Read the skill file**: Each agent has a detailed markdown file in their folder
2. **Understand capabilities**: What the agent can do and how
3. **Know limitations**: What the agent should NOT do
4. **Use as reference**: When directing agents to do work

### Skill File Format

Each skill file includes:
- **Agent Model**: Which Claude/GPT model to use
- **Primary Skill**: Main area of expertise
- **MCP Servers**: Tools the agent has access to
- **Core Skills**: 5-6 major skill areas
- **Input/Output Format**: How to communicate with agent
- **Tech Stack**: Technologies used
- **Success Criteria**: How to know work is done

---

## 🎯 Skill Categories

### Orchestration & Planning
- Task breakdown
- Dependency analysis
- Timeline estimation
- Risk management

### Design & Architecture
- System design
- API design
- Database design
- Code organization

### Implementation
- Frontend (React)
- Backend (FastAPI/Python)
- Database (PostgreSQL)

### Quality Assurance
- Unit testing
- Integration testing
- E2E testing
- Performance testing

### DevOps & Automation
- CI/CD pipelines
- Code quality checks
- Automated deployment
- Monitoring & logging

---

## 💡 Best Practices

### When Using Skills

1. **Read the skill file first** before asking agent to do work
2. **Provide clear context** about what you need
3. **Reference relevant documentation** (PRD, TECHNICAL_SETUP)
4. **Include file paths** if working with existing code
5. **Specify constraints** if any

### Agent Communication

```
✓ Clear, specific tasks
✓ Relevant context
✓ References to docs
✓ Expected output format
✓ Any constraints or limitations

✗ Vague requests
✗ No context
✗ Multiple tasks at once
✗ Contradictory requirements
```

---

## 🚀 Quick Start

### First Time Setup
1. Read this README.md
2. Read [docs/AGENTS.md](../docs/development/AGENTS.md)
3. Skim each skill file (5 min each)

### To Use Agents
1. Refer to appropriate skill file
2. Follow format guidelines
3. Provide context and constraints
4. Monitor progress through Orchestrator

### To Add New Skills
1. Create new markdown file in relevant folder
2. Follow format from existing skill files
3. Update this README.md
4. Commit to git

---

## 📊 Skill Categories by Agent

| Agent | Planning | Design | Coding | Testing | Deployment |
|-------|----------|--------|--------|---------|------------|
| Orchestration | ✓ | ✓ | - | - | - |
| Planning | ✓✓ | - | - | - | - |
| Architecture | ✓ | ✓✓ | - | - | - |
| UI/UX | - | ✓✓ | ✓ | - | - |
| Frontend | - | - | ✓✓ | ✓ | - |
| Backend | - | ✓ | ✓✓ | ✓ | - |
| Database | ✓ | ✓✓ | ✓ | ✓ | - |
| Testing | - | ✓ | ✓ | ✓✓ | ✓ |
| CI/CD | - | - | ✓ | ✓ | ✓✓ |

---

## 🔗 Related Documentation

- [AGENTS.md](../docs/development/AGENTS.md) - Agent architecture overview
- [DEVELOPERS.md](../docs/development/DEVELOPERS.md) - Code style guidelines
- [API_SPECIFICATION.md](../docs/technical/API_SPECIFICATION.md) - API endpoints
- [TECHNICAL_SETUP.md](../docs/technical/TECHNICAL_SETUP.md) - System architecture

---

## 📝 Notes

- Each agent has specific tools (MCP servers) they can access
- Agents work best when they have clear context
- Orchestration agent coordinates all other agents
- Skills are meant to be referenced, not followed rigidly
- Update skills as agents improve or requirements change

---

**Last Updated**: Febrero 2026  
**Total Agents**: 9  
**Total Skill Files**: 9  
**Total Skill Documentation**: 3,000+ lines

