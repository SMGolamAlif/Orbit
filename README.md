# Time Starter: React + Appwrite + Tailwind

Starter project with:

- React (Vite)
- Tailwind CSS
- Appwrite client integration
- Auth scaffold (login/register/logout)
- Protected route example
- ESLint + Prettier

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

- `src/config/appwrite.js`: Appwrite client setup
- `src/services/appwrite.js`: auth/database/storage helpers
- `src/context/AuthContext.jsx`: app auth state
- `src/components/ProtectedRoute.jsx`: route guard
- `src/pages/*`: starter pages

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
