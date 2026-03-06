---
layout: post
title: "MCP Interactive Server: Rendering Live UI Panels Inside AI Chat"
date: 2026-03-06
categories: [projects, ai]
tags: [mcp, python, typescript, vite, fastmcp, ai, copilot, claude]
---

I've been exploring the **Model Context Protocol (MCP)** and wanted to push it beyond simple tool calls. The result is **MCP Interactive Server** — a Python MCP server that renders fully interactive HTML applications directly inside AI chat hosts like **VS Code GitHub Copilot Chat** and **Claude Desktop**, without ever leaving the conversation.

You can find the source code on GitHub: [https://github.com/joealfa/mcp-server-interactive](https://github.com/joealfa/mcp-server-interactive)

## What Is MCP Apps?

MCP Apps is an extension of the Model Context Protocol that allows a server to embed interactive UI panels inside AI chat interfaces. Instead of returning plain text, a tool can return a `_meta.ui.resourceUri` that points to a bundled HTML application. The host fetches that resource and renders it in a sandboxed iframe right inside the chat.

The result: the user can click buttons, fill forms, and interact with live data — all without switching tabs or opening a browser.

## The Four Interactive UIs

The server ships with four fully implemented UI panels, each with its own MCP tools:

| UI | Tools | What It Does |
|---|---|---|
| **Poll / Survey** | `show_poll`, `submit_poll_answer`, `get_poll_results` | Multi-question poll with live bar-chart results |
| **Quiz / Trivia** | `show_quiz`, `submit_quiz_answer`, `get_leaderboard` | Timed trivia game with scoring and leaderboard |
| **Kanban Board** | `show_board`, `move_task`, `add_task`, `delete_task` | Three-column kanban with full CRUD |
| **System Monitor** | `show_monitor`, `get_system_stats` | Live CPU / memory / disk dashboard with top processes |

Just prompt the LLM — *"Show me the poll"*, *"Open the quiz"*, *"Show my task board"* — and the UI appears inline.

## Demo

<video controls width="100%" style="border-radius: 8px; margin: 1rem 0;">
  <source src="/assets/videos/mcp-server-interactive.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## How It Works

The interaction flow is straightforward:

```
User sends a message in Copilot Chat / Claude Desktop
        ↓
LLM calls an MCP tool (e.g. "show_poll")
        ↓
Tool result contains _meta.ui.resourceUri → ui://poll-app/panel.html
        ↓
Host fetches the resource (MIME: text/html;profile=mcp-app)
        ↓
Host renders the HTML in a sandboxed iframe inside the chat
        ↓
Initial data is pushed to the iframe via ontoolresult
        ↓
User interacts — clicks, forms, etc.
        ↓
UI calls app.callServerTool() → host relays to the Python server
        ↓
Server processes the action and returns updated data
        ↓
UI updates in place — no page reload, no tab switching
```

The architecture keeps the two sides cleanly separated:

```
┌─────────────────────────┐         ┌─────────────────────────────┐
│   Python MCP Server     │         │   TypeScript UI App         │
│   port 3001             │         │   (sandboxed iframe)        │
│                         │         │                             │
│  FastMCP tools          │◄────────│  mcp-app.ts (SDK wrapper)   │
│  MCP resources          │  relay  │  app.callServerTool()       │
│  Services / Domain      │ via host│  app.ontoolresult           │
└─────────────────────────┘         └─────────────────────────────┘
        Streamable HTTP                    postMessage (JSON-RPC)
        MCP spec 2025-03-26
```

## Technology Stack

### Python MCP Server

- **FastMCP** (official Python MCP SDK) — tool and resource registration
- **FastAPI** — async HTTP transport, CORS, health routes, Swagger docs
- **Pydantic + pydantic-settings** — schema validation and config
- **uv** — dependency management
- **Ruff** — linting and formatting
- **Pytest** — testing

### JavaScript UI Apps

- **`@modelcontextprotocol/ext-apps`** — MCP Apps SDK (`App` class)
- **Vite v6** — bundler with a custom `inline-assets.mjs` post-build step that inlines all JS and CSS into a single self-contained HTML file
- **TypeScript v5.7** — fully typed, no framework dependency

## Project Structure

```
mcp-server-interactive/
├── server/                 # Python MCP server
│   ├── app/
│   │   ├── main.py         # FastMCP + FastAPI entry point
│   │   ├── core/           # Config, logging, constants
│   │   ├── domain/         # Models + state machines
│   │   ├── schemas/        # Pydantic request / response schemas
│   │   ├── services/       # Business logic + session state
│   │   ├── tools/          # MCP tool definitions (one file per UI)
│   │   ├── resources/      # MCP resource handlers (serve HTML)
│   │   ├── agents/         # Pluggable AI agent registry
│   │   └── utils/
│   ├── tests/
│   └── pyproject.toml
├── ui/                     # TypeScript / Vite frontend apps
│   ├── src/
│   │   ├── mcp-app.ts      # Wrapper around @modelcontextprotocol/ext-apps
│   │   ├── poll-app.ts
│   │   ├── quiz-app.ts
│   │   ├── board-app.ts
│   │   └── monitor-app.ts
│   ├── templates/          # HTML entry points (Vite inputs)
│   ├── inline-assets.mjs   # Post-build: inlines JS/CSS into HTML
│   └── vite.config.ts
└── .env
```

## Architecture Layers

The server follows a clean layered design:

- **Tools layer** — exposes MCP tools to the LLM; UI-triggering tools include `_meta.ui.resourceUri`; delegates all logic to services
- **Resources layer** — serves built HTML from `ui/dist/templates/` at `ui://` URIs with the correct MIME type
- **Services layer** — business logic, session and state management (in-memory; Redis planned)
- **Domain layer** — pure state machine logic, framework-independent
- **Schemas layer** — strict Pydantic request/response contracts for every tool

## Quick Start

### Prerequisites

- Python >= 3.11
- [uv](https://docs.astral.sh/uv/getting-started/installation/)
- Node.js >= 18

### 1. Install and build

```bash
# Python server
cd server && uv sync

# UI apps
cd ui && npm install && npm run build
```

### 2. Run the server

```bash
cd server
uv run serve
```

The server starts on **http://localhost:3001**.
Health check: `/health` — Swagger docs: `/docs`

### 3. Connect your MCP client

Add this to your `mcp.json`:

```json
{
  "servers": {
    "interactive": {
      "url": "http://localhost:3001/mcp"
    }
  }
}
```

Then just ask the LLM to open any of the panels.

## UI Design

All four apps share a consistent dark-first design that blends naturally with VS Code and Claude Desktop. The colour palette is built around a dark slate base (`#0f172a`) with per-UI accent colours — indigo for the poll, amber for the quiz, sky blue for the board, and emerald for the monitor. Everything is self-contained: no external CDN dependencies, no web fonts to fetch.

## What's Next?

- Redis for persistent session storage
- Docker build (server + UI in one container)
- mypy strict type checking
- CI/CD pipeline
- AI agent integrations — LLM-driven quiz host, poll analysis agent

This project was a great way to explore what MCP can do beyond plain tool responses. Embedding live, interactive UIs directly inside the chat conversation opens up a lot of interesting possibilities for how AI assistants can present and handle data.
