import React, { createContext, useContext, useEffect, useState } from 'react'

interface FavouritesContextType {
  ids: string[]
  add: (id: string) => void
  remove: (id: string) => void
  has: (id: string) => boolean
  count: number
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined)
const STORAGE_KEY = 'ndlela_favourites_ids'

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as string[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      // ignore
    }
  }, [ids])

  const add = (id: string) => setIds(prev => (prev.includes(id) ? prev : [...prev, id]))
  const remove = (id: string) => setIds(prev => prev.filter(x => x !== id))
  const has = (id: string) => ids.includes(id)

  return (
    <FavouritesContext.Provider value={{ ids, add, remove, has, count: ids.length }}>
      {children}
    </FavouritesContext.Provider>
  )
}

export function useFavourites(): FavouritesContextType {
  const ctx = useContext(FavouritesContext)
  if (!ctx) throw new Error('useFavourites must be used within a FavouritesProvider')
  return ctx
}
