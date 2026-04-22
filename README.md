# Coding AI Agent

> Your AI-powered developer companion that understands your codebase and helps you code smarter.

## 🎯 Overview

**Coding AI Agent** is a command-line tool powered by AI that lets you interact with your codebase using natural language. Instead of manually reading through files or running commands, you can simply ask your AI agent to analyze code, debug issues, refactor functions, generate tests, or answer questions about your project and it does the work for you.

Think of it as having a knowledgeable teammate available 24/7 who knows your entire codebase and can help with coding tasks.

---

## ✨ What Can It Do?

- **Ask Questions** — "What's the purpose of this function?" or "How does authentication work in this app?"
- **Debug Issues** — Paste an error message and get AI-powered analysis and fixes
- **Refactor Code** — Ask the agent to improve code quality or restructure logic
- **Generate Tests** — Automatically create unit tests for your functions
- **Search & Analyze** — Search your codebase and get intelligent summaries
- **Fix Build Issues** — Get help debugging build errors
- **Execute Commands** — Run shell commands and let the AI interpret the results

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16 or higher
- **npm** or **yarn**
- One of the following:
  - **Groq API Key** (free, cloud-based, fast) — [Get one here](https://console.groq.com)
  

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd coding-ai-agents
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment:
   - Create a `.env` file in the root directory
   - Add your Groq API key (or leave blank to use Ollama):
     ```
     GROQ_API_KEY=your_api_key_here
     ```

4. Build the project:
   ```bash
   npm run build
   ```

---

## 📋 Available Commands

Once built, use the agent with these commands:

### `ask <question>`
Ask a one-shot question about your codebase.
```bash
npm run ask "How does the authentication system work?"
```

### `chat`
Start an interactive chat session with the agent. Ask multiple questions in a conversation.
```bash
npm run chat
```

### `debug <error_message>`
Paste an error message or stack trace and get AI-powered debugging suggestions.
```bash
npm run debug "TypeError: Cannot read property 'map' of undefined"
```

### `refactor`
Ask the agent to refactor your code for better quality, readability, or performance.
```bash
npm run refactor "Refactor the UserService class for better error handling"
```

### `test-gen`
Generate unit tests for your functions and components.
```bash
npm run test-gen "Generate tests for the payment validation function"
```

### `fix-build`
Get help debugging and fixing build errors.
```bash
npm run fix-build "The TypeScript build is failing with circular dependency errors"
```

---

## 🏗️ How It Works

The agent works by following a **ReAct-style loop** (Reasoning + Acting):

1. **You give a task** — Describe what you want the agent to do
2. **Agent thinks** — The AI LLM analyzes your request and decides what tools to use
3. **Agent acts** — It reads files, searches code, runs commands, or modifies files
4. **Agent learns** — Results from each action are fed back into the conversation
5. **Repeat** — This cycle continues until the task is complete (up to 10 iterations for safety)

The agent has access to several **tools** it can use:
- 📄 **List Files** — Explore your project structure
- 📖 **Read Files** — Read source code content
- ✍️ **Write Files** — Create or modify files
- 🔍 **Search Code** — Find patterns using regex or keywords
- 🖥️ **Run Commands** — Execute shell commands and capture output

---

### Project Structure

```
src/
├── agent/
│   ├── controller.ts       — Core agentic loop and task orchestration
│   └── executor.ts         — Routes tool calls to their implementations
├── cli/
│   └── index.ts            — Command-line interface entry point
├── config/
│   └── constants.ts        — System prompts and model defaults
├── llm/
│   ├── groqClient.ts       — Groq cloud inference
│   └── ollamaClient.ts     — Local Ollama inference (if available)
├── tools/
│   ├── fileTools.ts        — File read/write operations
│   ├── searchTools.ts      — Code search functionality
│   └── execTools.ts        — Shell command execution
└── utils/
    └── logger.ts           — Terminal output formatting
```

---

## 🔧 Development

### Build
```bash
npm run build
```

### Run in Development Mode (TypeScript directly)
```bash
npm run dev chat
npm run dev ask "Your question"
```

### Run Built Version
```bash
npm start
```

---

## 🎓 Understanding the Agent

### The Agentic Loop
Each command triggers the following flow:

1. **Context Building** — Agent reads your codebase to understand structure
2. **Planning** — LLM decides what tools to use based on your request
3. **Execution** — Each tool call is executed with the agent's instructions
4. **Feedback** — Results are added back to the conversation history
5. **Completion Check** — Agent determines if the task is done
6. **Response** — Final answer or code changes are presented to you

### Safety Features
- **Max 10 iterations** — Prevents infinite loops if something goes wrong
- **Selective file access** — Respects `.gitignore` and common build directories
- **Read-only mode** — By default, the agent observes before modifying
- **Clear logging** — See exactly what the agent is doing at each step

---



## 🚨 Troubleshooting

### "Agent keeps looping"
- The agent will stop after 10 iterations for safety
- If results seem incomplete, try breaking your request into smaller tasks

### "API rate limit exceeded"
- You're using Groq's free tier and hit limits
- Wait a while and retry, or switch to Ollama for unlimited local usage

### "Files aren't being modified"
- The agent needs explicit permission in your request
- Try: "Refactor this function and write the changes to the file"

---

## 💡 Tips & Best Practices

1. **Be specific** — Instead of "fix this code," try "optimize the database query in userRepository.ts for performance"
2. **Provide context** — Paste related error messages or code snippets
3. **Break it down** — Complex tasks work better when split into steps
4. **Review changes** — Always review AI-generated code before committing
5. **Start simple** — Test with questions before asking for code modifications

---

## 🔮 Future Enhancements

- [ ] Support for more LLM providers (OpenAI, Claude, etc.)
- [ ] Interactive mode with continuous conversation history
- [ ] Code diff preview before applying changes
- [ ] Integration with Git for automated commits
- [ ] Custom system prompts per project
- [ ] Streaming responses for faster feedback

---




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
| `GROQ_MODEL` | Override the default Groq model |

---

