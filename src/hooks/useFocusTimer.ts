import { useContext } from 'react'
import { FocusTimerContext } from '@/context/FocusTimerContext'

function useFocusTimer() {
  const context = useContext(FocusTimerContext)
  if (!context) {
    throw new Error('useFocusTimer must be used within a FocusTimerProvider')
  }
  return context
}

export { useFocusTimer }
