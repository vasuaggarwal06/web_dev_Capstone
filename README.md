# ⚔️ QuestBoard — Gamified Task Manager

A fully gamified task manager built with React (Vite), where every task you complete earns XP, levels you up, unlocks badges, and builds your streak.

---

## Tech Stack

| Layer            | Technology                                      |
|------------------|-------------------------------------------------|
| Frontend         | React 18, Vite 6                                |
| State Management | Context API + custom hooks                      |
| Routing          | React Router v7 (lazy-loaded pages)             |
| Styling          | Tailwind CSS v3 + custom CSS layers             |
| Persistence      | localStorage via custom `useLocalStorage` hook  |
| Fonts            | Orbitron, Sora, JetBrains Mono (Google Fonts)  |

---

## Features

### 🎮 Gamification
- **XP System** — tasks award XP based on difficulty (Easy: 25, Medium: 50, Hard: 100, Epic: 200)
- **10 Levels** — Novice → ⚡ Ascendant, each with a unique title and color
- **12 Badges** — across 4 rarity tiers (Common → Legendary), auto-unlocked on milestones
- **Streak Tracking** — daily streaks with fire/ice indicators and motivational messages

### 📋 Task Management
- Add, edit, delete tasks with full form validation
- Priority system: Easy / Medium / Hard / Epic
- Category tagging (Work, Personal, Health, Learning, Creative, Other)
- Due date support with overdue detection
- Mark complete / undo completion (XP adjusts automatically)

### 🔍 Filtering & Pagination
- Filter by status (All / Active / Completed)
- Filter by difficulty
- Full-text search across title and description
- Sort by newest, oldest, XP value, or due date
- Paginated task list (8 per page)

### 📊 Stats & Badges
- 7-day activity bar chart
- Category breakdown with progress bars
- Full level progression roadmap
- Difficulty breakdown with XP totals
- Badge collection with rarity tiers and unlock conditions

---

## Architecture

```
src/
├── context/
│   └── GameContext.jsx       # Central state — tasks, player, XP, streaks
├── hooks/
│   ├── useLocalStorage.js    # Persistent state with cross-tab sync
│   ├── usePagination.js      # Generic pagination logic
│   └── useToast.js           # Toast notification queue
├── utils/
│   ├── constants.js          # PRIORITIES, LEVELS, BADGES definitions
│   └── gameLogic.js          # XP calc, level info, streak logic, badge eval
├── components/
│   ├── Layout/Sidebar.jsx
│   ├── Game/{XPBar,LevelBadge,StreakCounter}.jsx
│   ├── Tasks/{TaskCard,TaskForm}.jsx
│   └── UI/{Modal,ToastContainer}.jsx
└── pages/
    ├── Dashboard.jsx
    ├── Tasks.jsx
    ├── Badges.jsx
    └── Stats.jsx
```

---

## Performance

- **Lazy loading** — all 4 pages are code-split via `React.lazy()` + `Suspense`
- **useMemo** — filtering, sorting, and chart data are memoized
- **useCallback** — all context actions are stable references
- **Pagination** — large task lists are paginated (8/page), never fully rendered

---

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

---

## Badge Unlock Conditions

| Badge           | Rarity    | Condition                       |
|-----------------|-----------|---------------------------------|
| First Quest     | Common    | Complete 1 task                 |
| Hat Trick       | Common    | Complete 3 tasks                |
| On Fire         | Common    | 3-day streak                    |
| Task Master     | Uncommon  | Complete 10 tasks               |
| Week Warrior    | Uncommon  | 7-day streak                    |
| Early Bird      | Uncommon  | Complete a task before 9 AM     |
| Quest Veteran   | Rare      | Complete 25 tasks               |
| Expert Rank     | Rare      | Reach Level 5                   |
| Epic Slayer     | Rare      | Complete 5 Epic tasks           |
| Speed Runner    | Rare      | 5 tasks in a single day         |
| Legendary Grind | Legendary | 30-day streak                   |
| Ascendant       | Legendary | Reach Level 10                  |
