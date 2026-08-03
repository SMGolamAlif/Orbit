import { useState, useCallback, useRef, type DragEvent } from 'react'

interface UseDragAndDropOptions<T> {
  items: T[]
  onReorder: (newItems: T[]) => void
  getItemId: (item: T) => string
}

interface UseDragAndDropReturn {
  dragProps: {
    onDragStart: (e: DragEvent<HTMLDivElement>) => void
    onDragOver: (e: DragEvent<HTMLDivElement>) => void
    onDrop: (e: DragEvent<HTMLDivElement>) => void
    onDragEnd: () => void
  }
  dropProps: (itemId: string) => {
    onDragOver: (e: DragEvent<HTMLDivElement>) => void
    onDrop: (e: DragEvent<HTMLDivElement>) => void
    onDragEnter: (e: DragEvent<HTMLDivElement>) => void
    onDragLeave: (e: DragEvent<HTMLDivElement>) => void
  }
  dragActive: string | null
}

export function useDragAndDrop<T>({
  items,
  onReorder,
  getItemId,
}: UseDragAndDropOptions<T>): UseDragAndDropReturn {
  const [dragActive, setDragActive] = useState<string | null>(null)
  const dragIndexRef = useRef<number>(-1)
  const dropTargetRef = useRef<string | null>(null)

  const handleDragStart = useCallback(
    (e: DragEvent<HTMLDivElement>, index: number) => {
      dragIndexRef.current = index
      const itemId = getItemId(items[index])
      setDragActive(itemId)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', itemId)
    },
    [items, getItemId],
  )

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const draggedId = e.dataTransfer.getData('text/plain')
      if (!draggedId || draggedId === dropTargetRef.current) return

      const draggedIndex = items.findIndex((item) => getItemId(item) === draggedId)
      const targetIndex = items.findIndex(
        (item) => getItemId(item) === dropTargetRef.current,
      )

      if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex)
        return

      const newItems = [...items]
      const [draggedItem] = newItems.splice(draggedIndex, 1)
      newItems.splice(targetIndex, 0, draggedItem)
      onReorder(newItems)
    },
    [items, getItemId, onReorder],
  )

  const handleDragEnd = useCallback(() => {
    setDragActive(null)
    dragIndexRef.current = -1
    dropTargetRef.current = null
  }, [])

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>, itemId: string) => {
    e.preventDefault()
    dropTargetRef.current = itemId
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    // Only clear if we're actually leaving the element
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      dropTargetRef.current = null
    }
  }, [])

  const dragProps = {
    onDragStart: (e: DragEvent<HTMLDivElement>) =>
      handleDragStart(e, dragIndexRef.current),
    onDragOver: handleDragOver,
    onDrop: handleDrop,
    onDragEnd: handleDragEnd,
  }

  const dropProps = (itemId: string) => ({
    onDragOver: handleDragOver,
    onDrop: handleDrop,
    onDragEnter: (e: DragEvent<HTMLDivElement>) => handleDragEnter(e, itemId),
    onDragLeave: handleDragLeave,
  })

  return { dragProps, dropProps, dragActive }
}
