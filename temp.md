# coding-ai-agents — Project Summary

## Overview

A **terminal-based agentic AI** that can analyze, understand, and modify a local codebase through natural language instructions. The agent runs as a CLI tool and supports two inference backends: **Groq** (cloud, fast) and **Ollama** (local, private).

---

## Architecture

```
src/
├── agent/
│   ├── controller.ts   — Orchestrates the agentic loop (think → act → repeat)
│   └── executor.ts     — Dispatches tool calls to the correct handler
├── cli/
│   └── index.ts        — CLI entry point (chat & task commands)
├── config/
│   └── constants.ts    — Default model, system prompt
├── llm/
│   ├── groqClient.ts   — Groq cloud inference client
│   └── ollamaClient.ts — Local Ollama inference client
├── tools/              — Tool implementations (file I/O, search, shell)
└── utils/
    └── logger.ts       — Coloured terminal logger
```

---

## Key Components

### AgentController (`controller.ts`)
Runs a **ReAct-style agentic loop** (up to 10 iterations):
1. Sends the conversation history to the LLM.
2. If the LLM returns tool calls → executes them and appends results.
3. If no tool calls → task is complete.

### ToolExecutor (`executor.ts`)
Routes tool calls to implementations:
| Tool | Description |
|---|---|
| `list_files` | List directory contents |
| `read_file` | Read a file's content |
| `write_file` | Overwrite a file |
| `search_code` | Search the codebase by regex/keyword |
| `run_command` | Execute a shell command |

### LLM Clients
- **GroqClient** — Uses `groq-sdk`; model defaults to `llama-3.3-70b-versatile`
- **OllamaClient** — Uses `ollama` npm package; model defaults to `llama3.2:latest`

Switch backends via the `.env` flag:
```env
USE_LOCAL_LLM=No    # Groq (default)
USE_LOCAL_LLM=Yes   # Ollama (local)
```

---

## Running the Project

```bash
# Build
npm run build

# Interactive chat session
npm run chat

# One-shot task
npm run task -- "refactor the executor to add better error handling"
```

---

## Environment Variables (`.env`)

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Groq API key |
| `USE_LOCAL_LLM` | `Yes` / `No` — toggle Ollama vs Groq |
| `GROQ_MODEL` | Override the default Groq model |
| `OLLAMA_MODEL` | Override the default Ollama model |

---

