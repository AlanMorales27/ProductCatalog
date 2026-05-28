import { useState } from 'react'
import './App.css'
import { ProductsTable } from './components/ProductsTable'
import { NewProductForm } from './components/NewProductForm'

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="max-w-[1100px] mx-auto px-8 pt-14 pb-24">
      <header className="flex items-end justify-between gap-6 mb-7">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight m-0 mb-1">Productos</h1>
          <p className="text-[#6b6960] m-0 text-sm">Catálogo de ropa.</p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg font-medium text-sm bg-[#5b5be0] text-white shadow-[0_1px_2px_rgba(28,27,24,0.08),inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-[#4747c7] transition-colors"
        >
          Nuevo producto
        </button>
      </header>

      <ProductsTable />

      <NewProductForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCreated={() => { /* opcional: refrescar tabla */ }}
      />
    </div>
  )
}

export default App
