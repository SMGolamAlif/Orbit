import { taskService } from '@/services/tasks'
import { noteService } from '@/services/notes'
import type { TaskInput } from '@/types/task'
import type { NoteInput } from '@/types/note'

const STARTER_TASKS: TaskInput[] = [
  {
    title: 'Take a 20-minute walk outside',
    status: 'todo',
    priority: 'medium',
    category: 'Health',
    dueDate: null,
    order: 1,
  },
  {
    title: 'Call or message someone you love',
    status: 'todo',
    priority: 'high',
    category: 'Personal',
    dueDate: null,
    order: 2,
  },
  {
    title: 'Read 10 pages of a book',
    status: 'todo',
    priority: 'low',
    category: 'Growth',
    dueDate: null,
    order: 3,
  },
  {
    title: "Plan tomorrow's top 3 priorities",
    status: 'doing',
    priority: 'medium',
    category: 'Work',
    dueDate: null,
    order: 4,
  },
  {
    title: 'Write down one thing you are grateful for',
    status: 'done',
    priority: 'low',
    category: 'Mind',
    dueDate: null,
    order: 5,
  },
]

const STARTER_NOTES: NoteInput[] = [
  {
    title: 'Welcome to Orbit',
    content:
      'Every square on your Life Calendar is a week you get to live once. Orbit helps you see the shape of your time so you can spend it on what matters — use Tasks and Kanban to move your days forward, and Notes to capture what you learn along the way.',
    tags: 'welcome, orbit',
    pinned: true,
  },
  {
    title: 'Ideas worth exploring',
    content:
      'A short list of things worth trying: learning a new skill, writing a little every day, saying yes to more spontaneous adventures.',
    tags: 'ideas',
    pinned: false,
  },
  {
    title: 'Gratitude',
    content: 'Good health, people who care about me, and the freedom to choose how I spend my time.',
    tags: 'gratitude, reflection',
    pinned: false,
  },
]

async function seedStarterTasks(userId: string): Promise<void> {
  await Promise.all(STARTER_TASKS.map((task) => taskService.createTask(userId, task)))
}

async function seedStarterNotes(userId: string): Promise<void> {
  await Promise.all(STARTER_NOTES.map((note) => noteService.createNote(userId, note)))
}

export { seedStarterTasks, seedStarterNotes }
