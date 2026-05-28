import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { ProductsTable } from './components/ProductsTable'
import { NewProductForm } from './components/NewProductForm'
import { SearchInput } from './components/SearchInput'
import { getProducts } from './api/getProducts'
import { deleteProduct } from './api/deleteProduct'

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState("")
  const [debounced, setDebounced] = useState("")

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 220)
    return () => clearTimeout(id)
  }, [query])

  const fetchProducts = useCallback(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    getProducts(controller.signal)
      .then(setProducts)
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message)
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  useEffect(() => fetchProducts(), [fetchProducts])

  const openCreate = () => { setEditing(null); setDrawerOpen(true) }
  const openEdit = (p) => { setEditing(p); setDrawerOpen(true) }
  const closeForm = () => { setDrawerOpen(false); setEditing(null) }

  const handleDelete = async (p) => {
    if (!window.confirm(`¿Borrar "${p.name}"?`)) return
    try {
      await deleteProduct(p.id)
      fetchProducts()
    } catch {
      window.alert("No se pudo borrar el producto")
    }
  }

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    if (!q) return products
    return products.filter(p =>
      p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    )
  }, [products, debounced])

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
