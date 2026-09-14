import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/600.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { client } from './config/appwrite'
import { AccentProvider } from './context/AccentContext'
import { AlarmProvider } from './context/AlarmContext'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

client.ping().catch((error: unknown) => {
  console.error('Appwrite ping failed during app bootstrap.', error)
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - prevent auto-refetch
      gcTime: 10 * 60 * 1000, // 10 minutes - keep inactive data
      retry: 1, // Retry failed queries once
      networkMode: 'always', // Request even if offline
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: true, // Refetch when reconnecting
    },
    mutations: {
      networkMode: 'always', // Send mutations even if offline
      retry: 1, // Retry failed mutations once
    },
  },
})

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found.')
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <AccentProvider>
        <AlarmProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <AuthProvider>
                <App />
              </AuthProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </AlarmProvider>
      </AccentProvider>
    </ThemeProvider>
  </StrictMode>,
)
