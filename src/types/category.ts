interface Category {
  $id: string
  $createdAt: string
  userId: string
  name: string
  color: string
  isCustom: boolean
}

interface CategoryInput {
  name: string
  color: string
  isCustom: boolean
}

export type { Category, CategoryInput }
