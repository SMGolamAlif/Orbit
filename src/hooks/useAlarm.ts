import { useContext } from 'react'
import { AlarmContext, type AlarmContextValue } from '@/context/AlarmContext'

function useAlarm(): AlarmContextValue {
  const context = useContext(AlarmContext)
  if (!context) {
    throw new Error('useAlarm must be used within an AlarmProvider')
  }
  return context
}

export { useAlarm }
