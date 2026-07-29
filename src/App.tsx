import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import ProtectedRoute from '@/components/ProtectedRoute'
import Clock from '@/pages/Clock'
import Dashboard from '@/pages/Dashboard'
import FocusTimer from '@/pages/FocusTimer'
import Insights from '@/pages/Insights'
import Kanban from '@/pages/Kanban'
import LifeCalendarPage from '@/pages/LifeCalendarPage'
import Login from '@/pages/Login'
import Notes from '@/pages/Notes'
import Onboarding from '@/pages/Onboarding'
import Register from '@/pages/Register'
import Settings from '@/pages/Settings'
import Tasks from '@/pages/Tasks'

function App() {
  return (
    <Routes>
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
        <Route path="/" element={<Dashboard />} />
        <Route path="/life-calendar" element={<LifeCalendarPage />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/focus-timer" element={<FocusTimer />} />
        <Route path="/clock" element={<Clock />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
