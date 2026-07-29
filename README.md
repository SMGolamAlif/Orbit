# Orbit — Own Your Time

<p align="center">
  <img src="src/assets/Screenshot.png" alt="Orbit Dashboard Screenshot" width="800" />
</p>

**Orbit** is a personal time-management and life-tracking dashboard built with React, TypeScript, and Appwrite. It helps you visualize your life in weeks, stay focused with a Pomodoro-style timer, manage tasks & notes, and gain insights into how you spend your most valuable resource — time.

### ✨ Features

- **Life Calendar** — See your entire life in weeks. A powerful, humbling visualization inspired by _Your Life in Weeks_.
- **Focus Timer** — Built-in Pomodoro timer with session tracking to keep you in flow.
- **Task Management** — Kanban board and list views for organizing your work.
- **Quick Notes** — Jot down thoughts without leaving the dashboard.
- **Weekly Overview** — At-a-glance summary of your week's progress.
- **Insights** — Analytics and trends on your focus sessions and productivity.
- **Dark/Light Themes** — Beautiful glassmorphism UI with accent color customization.
- **Authentication** — Secure login, registration, and onboarding flow via Appwrite.

### 🛠 Tech Stack

| Layer         | Technology                         |
| ------------- | ---------------------------------- |
| Framework     | React 19 + TypeScript              |
| Build Tool    | Vite                               |
| Styling       | Tailwind CSS + Glassmorphism       |
| Backend       | Appwrite (Auth, Database, Storage) |
| Routing       | React Router v7                    |
| Animations    | Framer Motion                      |
| Icons         | Lucide React                       |
| Data Fetching | TanStack React Query               |

---

## 1) Install

```bash
npm install
```

## 2) Configure Appwrite

Create `.env.local` in the project root using `.env.example`:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id
```

Also add your local Vite URL (usually `http://localhost:5173`) to Appwrite platform settings.

## 3) Run

```bash
npm run dev
```

## 4) Useful Scripts

```bash
npm run lint
npm run format
npm run build
```

## Project Layout

```
src/
├── assets/              # Static assets (images, screenshots)
├── components/
│   ├── dashboard/      # Dashboard widget cards
│   ├── layout/         # AppShell, Sidebar, Topbar, Footer
│   └── ui/             # Reusable UI primitives (Button, GlassCard, etc.)
├── config/             # Appwrite client configuration
├── context/            # React contexts (Auth, Theme, Accent, FocusTimer)
├── hooks/              # Custom hooks (useAuth, useTheme, useTasks, etc.)
├── lib/                # Utility libraries (life calendar, focus sessions)
├── pages/              # Route-level page components
├── services/           # Appwrite service helpers (auth, notes, tasks, profile)
└── types/              # TypeScript type definitions
```
