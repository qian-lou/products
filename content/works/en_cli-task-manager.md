---
title: "CLI Task Manager"
slug: "cli-task-manager"
date: "2025-11-08"
excerpt: "A terminal-based task management tool with keyboard navigation, syntax highlighting, and SQLite storage. Built with Go for cross-platform compatibility."
tags:
  - Go
  - CLI
  - SQLite
  - TUI
cover: "/images/works/cli-task-cover.svg"
github: "https://github.com/username/cli-task-manager"
featured: false
---

## Introduction

A command-line task manager that brings the power of GUI applications to the terminal. Features include:

- Keyboard-driven interface
- Real-time search and filtering
- Due date reminders
- Data export (JSON, CSV)

## Installation

```bash
# Using Homebrew
brew install username/task-cli

# Using Go
go install github.com/username/task-cli@latest
```

## Usage

```bash
# Add a task
task add "Complete documentation" -t work -d tomorrow

# List tasks
task list --all

# Complete a task
task done 1
```

## Design Philosophy

### Minimal Dependencies

The only external dependency is SQLite for data persistence. All UI components are built using the standard library and [Bubble Tea](https://github.com/charmbracelet/bubbletea).

### Performance First

- Startup time: < 50ms
- Memory usage: < 10MB
- Works with 10k+ tasks without lag

## Key Bindings

| Key | Action |
|-----|--------|
| `j/k` | Navigate up/down |
| `Enter` | Select |
| `n` | New task |
| `d` | Delete |
| `q` | Quit |

## Technical Details

Built with:

- Go 1.21+
- SQLite (embedded)
- Bubble Tea (TUI framework)
- Cobra (CLI framework)
