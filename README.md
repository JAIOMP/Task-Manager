# Todolo

A local-first task manager built with Vue 3. All data stays in your browser (`localStorage`) — no account or backend required.

## Table of contents

- [Getting started](#getting-started)
- [How to use](#how-to-use)
  - [Create a task](#1-create-a-task)
  - [Edit a task](#2-edit-a-task)
  - [Complete and delete](#3-complete-and-delete)
  - [Reorder tasks](#4-reorder-tasks)
  - [Subtasks](#5-subtasks)
  - [Filter and search](#6-filter-and-search)
  - [Priority and tags](#7-priority-and-tags)
  - [Lists / projects](#8-lists--projects)
  - [Sort](#9-sort)
  - [Due dates and calendar](#10-due-dates-and-calendar)
  - [Dark mode](#11-dark-mode)
  - [Bulk actions](#12-bulk-actions)
  - [Export and import](#13-export-and-import-move-to-another-device)
  - [Keyboard shortcuts](#14-keyboard-shortcuts)
  - [Mobile gestures](#15-mobile-gestures)
- [Stats bar](#stats-bar)
- [Data storage](#data-storage)
- [Project commands](#project-commands)
- [Tech stack](#tech-stack)

---

## Getting started

1. Install [Node.js](https://nodejs.org/) (LTS recommended).
2. Clone the repo and install dependencies:

```bash
npm install
```

3. Start the app:

```bash
npm run serve
```

4. Open [http://localhost:8080](http://localhost:8080).

On first load with empty storage, Todolo seeds two example tasks so the UI is not blank.

---

## How to use

### 1. Create a task

1. Click the **Add a task** input at the top of the list (or press `N`).
2. Type a title.
3. Optionally use the quick options row that appears while the input is focused:
   - Priority (High / Medium / Low)
   - Due date
   - Tags (press Enter or comma to add)
4. Press **Enter** or click **Add**.

### 2. Edit a task

1. Click the task title.
2. The detail panel opens from the right (full screen on mobile).
3. Edit title, description, priority, due date, due time, tags, list, or subtasks.
4. Changes save automatically when you leave a field (look for the **Saved** flash).
5. Close with `Esc`, the ✕ button, or by clicking the backdrop.

### 3. Complete and delete

**Complete**

1. Click the checkbox on the left of a task row.
2. The title gets a strikethrough animation and `completedAt` is recorded.

**Delete**

1. Hover a task and click ✕, or focus the row and press `D`.
2. A toast appears: **Task deleted · Undo**.
3. Click **Undo** within 5 seconds to restore it (or press `Ctrl+Z` / `Cmd+Z`).

### 4. Reorder tasks

1. Set sort to **Manual order** (default).
2. Hover a task row and drag using the `⠿` handle on the left.
3. Drop it in the new position — order is saved and survives refresh.

### 5. Subtasks

1. Open a task’s detail panel.
2. In **Subtasks**, type a title and press Enter.
3. Check off or delete individual subtasks.
4. On the main list, a progress label like `2/5` appears next to the title when subtasks exist.

### 6. Filter and search

**Filter tabs** (above the list)

| Tab | Shows |
| --- | --- |
| All | Every task |
| Active | Incomplete tasks |
| Completed | Completed tasks |
| Today | Tasks due today |
| Overdue | Incomplete tasks past their due date |

The last-used filter is remembered.

**Search**

1. Focus search with `/` or click the search box.
2. Type to filter by title, description, or tags.
3. Press `Esc` to clear.
4. When searching, a result count like `3 results for 'meeting'` appears.

### 7. Priority and tags

**Priority**

1. Set High / Medium / Low in the create row or detail panel.
2. A colored left border appears on the task row (red / amber / green).

**Tags**

1. In the detail panel (or create row), type a tag and press Enter or comma.
2. Remove a tag with × on the pill.
3. Use **Filter by tag** in the toolbar to show only tasks with that tag.

### 8. Lists / projects

1. In the left sidebar, click **+ New list**.
2. Enter a name, pick a color, click **Add**.
3. Click a list name to show only tasks in that list (**All tasks** shows everything).
4. Assign a task to a list from the detail panel’s **List** field.
5. To delete a list: click **…** (or right-click the list) → **Delete list**. Tasks become uncategorized; they are not deleted.
6. Collapse the sidebar with «; reopen with the menu button when collapsed.

### 9. Sort

1. Open the **Sort** dropdown in the toolbar.
2. Choose: Manual order · Due date · Priority · Date created · Alphabetical.
3. Click **↑ / ↓** to toggle ascending / descending.
4. Sort preference is persisted.

### 10. Due dates and calendar

1. Set a due date in the create row or detail panel.
2. Optionally set a **due time** in the detail panel.
3. Overdue tasks show red date text and an **Overdue** badge.
4. To add a calendar reminder:
   1. Open the task and ensure a due date is set.
   2. Click **Add to calendar**.
   3. An `.ics` file downloads — open it in Google Calendar, Apple Calendar, Outlook, etc.
   4. The button becomes **Reminder set ✓**; use **Export again** to re-download.

### 11. Dark mode

1. Click the sun / moon icon in the top-right of the header.
2. Theme is saved and restored on next visit.

### 12. Bulk actions

1. Click **Select** in the toolbar.
2. Check tasks (or use **Select all**).
3. Use the bottom bar: Mark complete · Mark incomplete · Delete · Set priority · Assign to list.
4. Exit with **Done**, **Cancel**, `Esc`, or by clicking outside the list.

### 13. Export and import (move to another device)

**Export on device A**

1. Click **Export / import**.
2. Choose **Export as JSON** (recommended — includes tasks and lists) or **Export as CSV** (tasks only).
3. Save the file (e.g. transfer via email, AirDrop, cloud drive).

**Import on device B**

1. Open Todolo on the other device/browser.
2. Click **Export / import**.
3. Choose a mode:
   - **Replace all** — overwrite local tasks (and lists, for JSON backups).
   - **Merge by id** — keep local data and upsert matching ids.
4. Click **Choose file** and select the JSON or CSV export.
5. Use **Undo** in the toast if you need to reverse the import.

Tip: prefer the JSON backup when moving between devices so lists/projects come along.

### 14. Keyboard shortcuts

Press `?` anywhere (when not typing in an input) to open the shortcuts modal.

| Key | Action |
| --- | --- |
| `N` | Focus new task input |
| `/` | Focus search |
| `E` | Open detail panel for focused task |
| `D` | Delete focused task |
| `Space` | Toggle complete on focused task |
| `Esc` | Close panel / clear search / exit selection |
| `Ctrl+Z` / `Cmd+Z` | Undo last action |
| `?` | Show shortcuts |

Focus a task row by clicking or tabbing to it before using `E`, `D`, or `Space`.

### 15. Mobile gestures

On touch devices:

1. Swipe a task row **right** to complete.
2. Swipe a task row **left** to delete.

---

## Stats bar

Just under the header you always see:

- Tasks completed today
- Overall progress (`completed / total` and percentage)
- Overdue count (highlighted when > 0)
- Tasks due in the next 7 days

Counts update live as you change tasks.

---

## Data storage

Todolo persists everything in the browser:

| Key | Contents |
| --- | --- |
| `todolo_tasks` | All tasks (including subtasks, tags, order, etc.) |
| `todolo_lists` | Lists / projects |
| `todolo_prefs` | Theme, filter, sort, active list, tag filter, sidebar state |

Clearing site data for this origin will wipe your tasks. Use **Export as JSON** before switching browsers or devices.

---

## Project commands

| Command | Description |
| --- | --- |
| `npm run serve` | Dev server at `http://localhost:8080` |
| `npm run build` | Production build into `dist/` |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (watch mode by default via Vitest CLI) |
| `npm run test:coverage` | Coverage report |
| `npm run test:watch` | Vitest watch mode |

---

## Tech stack

- Vue 3 + TypeScript + SCSS
- Composables for task/list/prefs/undo/keyboard state
- `localStorage` persistence (no backend)
- SortableJS for drag-and-drop
- Vitest for unit tests
