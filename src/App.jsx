import { useMemo, useState } from 'react'
import { useStore } from './store/StoreContext'
import Header from './components/Header'
import Hero from './components/Hero'
import MenuList from './components/MenuList'
import CartBar from './components/CartBar'
import CheckoutSheet from './components/CheckoutSheet'
import InstallPrompt from './components/InstallPrompt'
import RunwayDivider from './components/RunwayDivider'
import LocationMap from './components/LocationMap'

export default function App() {
  // Data menu & info toko (lokal, atau dari Google Sheets kalau diaktifkan).
  const { business, menu } = useStore()
  // State keranjang: { [id]: qty }. Sesuai permintaan: pakai React state saja.
  const [qtyById, setQtyById] = useState({})
  const [sheetOpen, setSheetOpen] = useState(false)

  const inc = (id) => setQtyById((s) => ({ ...s, [id]: (s[id] || 0) + 1 }))
  const dec = (id) =>
    setQtyById((s) => {
      const next = (s[id] || 0) - 1
      const copy = { ...s }
      if (next <= 0) delete copy[id]
      else copy[id] = next
      return copy
    })
  const remove = (id) =>
    setQtyById((s) => {
      const copy = { ...s }
      delete copy[id]
      return copy
    })
  const qtyOf = (id) => qtyById[id] || 0

  // Gabungkan data menu dengan qty jadi array keranjang siap pakai.
  const cart = useMemo(
    () =>
      menu
        .filter((m) => qtyById[m.id] > 0)
        .map((m) => ({ id: m.id, name: m.name, price: m.price, qty: qtyById[m.id] })),
    [qtyById, menu],
  )

  const count = cart.reduce((s, i) => s + i.qty, 0)
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const minPrice = useMemo(() => (menu.length ? Math.min(...menu.map((m) => m.price)) : 0), [menu])

  const scrollToMenu = () => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="min-h-screen">
      <Header />
      <Hero minPrice={minPrice} onOrderClick={scrollToMenu} />

      <main>
        <div className="mx-auto max-w-xl px-4">
          <InstallPrompt />
          <RunwayDivider className="mt-5" />
        </div>
        <MenuList menu={menu} qtyOf={qtyOf} onInc={inc} onDec={dec} />
        <LocationMap />
      </main>

      {/* Padding bawah biar konten tidak ketutup CartBar */}
      <div className="h-24" />

      <footer className="mx-auto max-w-xl px-4 pb-6 text-center text-xs text-brand-brown/50">
        {business.emoji} {business.name} · {business.openLabel} · {business.area}
      </footer>

      <CartBar count={count} subtotal={subtotal} onOpen={() => setSheetOpen(true)} />
      <CheckoutSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        cart={cart}
        onInc={inc}
        onDec={dec}
        onRemove={remove}
      />
    </div>
  )
}
