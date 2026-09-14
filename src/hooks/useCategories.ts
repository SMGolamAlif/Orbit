import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoryService } from '@/services/categories'
import { useAuth } from './useAuth'
import type { CategoryInput } from '@/types/category'

const DEFAULT_CATEGORIES = [
  { name: 'Work', isCustom: false, color: 'primary' },
  { name: 'Health', isCustom: false, color: 'success' },
  { name: 'Growth', isCustom: false, color: 'default' },
  { name: 'Mind', isCustom: false, color: 'warning' },
  { name: 'Personal', isCustom: false, color: 'danger' },
  { name: 'Study', isCustom: false, color: 'primary' },
]

function useCategories() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories', user?.$id],
    queryFn: async () => {
      if (!user) return []
      try {
        const userCategories = await categoryService.listCategories(user.$id)
        const customNames = new Set(userCategories.map((c) => c.name))
        const defaults = DEFAULT_CATEGORIES.filter((d) => !customNames.has(d.name)).map(
          (d) => ({
            $id: d.name.toLowerCase(),
            $createdAt: '',
            userId: user.$id,
            ...d,
          }),
        )
        return [...defaults, ...userCategories]
      } catch (err) {
        console.error('Error loading categories:', err)
        // Return defaults if loading fails (collection might not exist yet)
        return DEFAULT_CATEGORIES.map((d) => ({
          $id: d.name.toLowerCase(),
          $createdAt: '',
          userId: user.$id,
          ...d,
        }))
      }
    },
    enabled: !!user,
  })

  const createCategoryMutation = useMutation({
    mutationFn: async (input: CategoryInput) => {
      if (!user) throw new Error('User not authenticated')
      try {
        const result = await categoryService.createCategory(user.$id, input)
        console.log('Category created:', result)
        return result
      } catch (err) {
        console.error('Error creating category:', err)
        throw err
      }
    },
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: ['categories', user?.$id] })
      const previousCategories = queryClient.getQueryData(['categories', user?.$id]) || []
      queryClient.setQueryData(['categories', user?.$id], (old: any) => {
        const currentArray = old || []
        return [
          ...currentArray,
          {
            $id: `temp-${Date.now()}`,
            $createdAt: new Date().toISOString(),
            userId: user!.$id,
            ...newCategory,
          },
        ]
      })
      return { previousCategories }
    },
    onError: (err, _newCategory, context) => {
      console.error('Mutation error:', err)
      if (context?.previousCategories) {
        queryClient.setQueryData(['categories', user?.$id], context.previousCategories)
      }
    },
    onSuccess: (newCategory) => {
      // Update cache with the real server response, replacing temp entries
      queryClient.setQueryData(['categories', user?.$id], (old: any) => {
        if (!old) return [newCategory]
        // Remove any temp entries and add the real one
        return [...old.filter((c: any) => !c.$id.startsWith('temp-')), newCategory]
      })
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      return categoryService.deleteCategory(categoryId)
    },
    onMutate: async (categoryId) => {
      await queryClient.cancelQueries({ queryKey: ['categories', user?.$id] })
      const previousCategories = queryClient.getQueryData(['categories', user?.$id])
      queryClient.setQueryData(['categories', user?.$id], (old: any) =>
        old.filter((c: any) => c.$id !== categoryId),
      )
      return { previousCategories }
    },
    onError: (_err, _categoryId, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(['categories', user?.$id], context.previousCategories)
      }
    },
    onSuccess: (_, categoryId) => {
      // Update cache to ensure the category is removed
      queryClient.setQueryData(
        ['categories', user?.$id],
        (old: any) => old?.filter((c: any) => c.$id !== categoryId) || [],
      )
    },
  })

  const createCategory = async (input: CategoryInput) => {
    return createCategoryMutation.mutateAsync(input)
  }

  const deleteCategory = async (categoryId: string) => {
    return deleteCategoryMutation.mutateAsync(categoryId)
  }

  return {
    categories,
    isLoading,
    createCategory,
    deleteCategory,
    isCreating: createCategoryMutation.isPending,
  }
}

export { useCategories }
