import { useState } from 'react'
import './App.css'
import { ProductsTable } from './components/ProductsTable'
import { NewProductForm } from './components/NewProductForm'
import { SearchInput } from './components/SearchInput'
import { useToast } from './hooks/useToast'
import { useProducts } from './hooks/useProducts'
import { useSearch } from './hooks/useSearch'

function App() {
  const pushToast = useToast()
  const { products, loading, error, fetchProducts, handleDelete } = useProducts(pushToast)
  const { query, setQuery, filtered, debounced } = useSearch(products)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const openCreate = () => { setEditing(null); setDrawerOpen(true) }
  const openEdit = (p) => { setEditing(p); setDrawerOpen(true) }
  const closeForm = () => { setDrawerOpen(false); setEditing(null) }

  const total = filtered.length
  const countLabel = loading
    ? "Cargando…"
    : debounced
      ? `${total} ${total === 1 ? "resultado" : "resultados"} para "${debounced}"`
      : `${total} ${total === 1 ? "producto" : "productos"}`

  return (
    <div className="max-w-[1100px] mx-auto px-8 pt-14 pb-24">
      <header className="flex items-end justify-between gap-6 mb-7">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight m-0 mb-1">Productos</h1>
          <p className="text-[#6b6960] m-0 text-sm">Catálogo de ropa.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg font-medium text-sm bg-[#5b5be0] text-white shadow-[0_1px_2px_rgba(28,27,24,0.08),inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-[#4747c7] transition-colors"
        >
          Nuevo producto
        </button>
      </header>

      <div className="flex items-center gap-3 mb-4">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Buscar por nombre o SKU…"
        />
        <div className="flex-1" />
        <span className="text-[#6b6960] text-[13px]">{countLabel}</span>
      </div>

      <ProductsTable
        products={filtered}
        loading={loading}
        error={error}
        hasQuery={!!debounced}
        onClearQuery={() => setQuery("")}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <NewProductForm
        open={drawerOpen}
        onClose={closeForm}
        onSaved={() => fetchProducts()}
        product={editing}
      />
    </div>
  )
}

export default App
