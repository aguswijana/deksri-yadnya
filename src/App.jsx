import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Navbar from './components/Navbar'
import ProductCard from './components/ProductCard'
import CartDrawer from './components/CartDrawer'
import CheckoutForm from './components/CheckoutForm'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) console.error('Error:', error)
      else setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-[#FBF5E9]">
      <Navbar onCartClick={() => setCartOpen(true)} />

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-[#6B1E23]">Perlengkapan Upacara Hindu</h1>
        <p className="text-[#2B2018]/70 mt-2">Banten, canang, dan sarana upacara siap antar.</p>

        {loading ? (
          <p className="mt-8 text-[#2B2018]/60">Memuat produk...</p>
        ) : products.length === 0 ? (
          <p className="mt-8 text-[#2B2018]/60">Belum ada produk.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false)
          setCheckoutOpen(true)
        }}
      />

      <CheckoutForm isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  )
}

export default App