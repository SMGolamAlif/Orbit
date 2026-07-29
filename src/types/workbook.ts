interface WorkbookEntry {
  $id: string
  $createdAt: string
  $updatedAt: string
  date: string // ISO date string e.g. "2026-07-30"
  title: string
  description: string
  startTime: string // "HH:MM"
  endTime: string // "HH:MM"
  productive: boolean
}

interface WorkbookEntryInput {
  date: string
  title: string
  description: string
  startTime: string
  endTime: string
  productive: boolean
}

export type { WorkbookEntry, WorkbookEntryInput }
