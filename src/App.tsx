import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import ProtectedRoute from '@/components/ProtectedRoute'
import Clock from '@/pages/Clock'
import Dashboard from '@/pages/Dashboard'
import FocusTimer from '@/pages/FocusTimer'
import Habits from '@/pages/Habits'
import Insights from '@/pages/Insights'
import Kanban from '@/pages/Kanban'
import Landing from '@/pages/Landing'
import LifeCalendarPage from '@/pages/LifeCalendarPage'
import Login from '@/pages/Login'
import Notes from '@/pages/Notes'
import Onboarding from '@/pages/Onboarding'
import Register from '@/pages/Register'
import Settings from '@/pages/Settings'
import Tasks from '@/pages/Tasks'
import Workbook from '@/pages/Workbook'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute requireProfile={false}>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/life-calendar" element={<LifeCalendarPage />} />
        <Route path="/app/tasks" element={<Tasks />} />
        <Route path="/app/kanban" element={<Kanban />} />
        <Route path="/app/notes" element={<Notes />} />
        <Route path="/app/workbook" element={<Workbook />} />
        <Route path="/app/focus-timer" element={<FocusTimer />} />
        <Route path="/app/clock" element={<Clock />} />
        <Route path="/app/insights" element={<Insights />} />
        <Route path="/app/habits" element={<Habits />} />
        <Route path="/app/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
