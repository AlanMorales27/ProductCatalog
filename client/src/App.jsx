import { useState } from 'react'
import './App.css'
import { ProductsTable } from './components/ProductsTable'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ProductsTable/>
    </>
  )
}

export default App
