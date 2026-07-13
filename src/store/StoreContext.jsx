import { createContext, useContext, useEffect, useState } from 'react'
import { business as defaultBusiness } from '../data/config'
import { menu as defaultMenu } from '../data/menu'
import { fetchStoreData, sheetEnabled } from './remote'

// Context menyediakan data toko (business + menu) yang aktif.
// Default = data lokal (config.js + menu.js). Kalau Google Sheets aktif &
// berhasil dimuat, data lokal ditimpa data dari sheet. Kalau gagal/offline,
// tetap pakai data lokal sebagai cadangan — jadi app selalu jalan.
const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [business, setBusiness] = useState(defaultBusiness)
  const [menu, setMenu] = useState(defaultMenu)
  const [source, setSource] = useState('local') // 'local' | 'sheet'

  useEffect(() => {
    if (!sheetEnabled()) return
    let alive = true
    fetchStoreData()
      .then(({ menu: remoteMenu, info }) => {
        if (!alive) return
        setMenu(remoteMenu)
        setBusiness({ ...defaultBusiness, ...info })
        setSource('sheet')
      })
      .catch((err) => {
        // Diamkan — cukup pakai data lokal. Log kecil untuk debugging.
        console.warn('[Store] Pakai data lokal:', err.message)
      })
    return () => {
      alive = false
    }
  }, [])

  return <StoreContext.Provider value={{ business, menu, source }}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore harus dipakai di dalam <StoreProvider>')
  return ctx
}
