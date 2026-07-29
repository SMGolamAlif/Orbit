import { useContext } from 'react'
import { AccentContext } from '@/context/AccentContext'

function useAccent() {
  const context = useContext(AccentContext)
  if (!context) {
    throw new Error('useAccent must be used within an AccentProvider')
  }
  return context
}

export { useAccent }
