import { useRef } from 'react'
import { useCart } from '../context/CartContext'
import { flyToCart } from '../lib/flyToCart'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const buttonRef = useRef(null)

  function handleAddToCart() {
    flyToCart(buttonRef.current, product.image_url)
    addToCart(product)
  }

  return (
    <div className="bg-[#F4ECDB] rounded-2xl overflow-hidden border border-[#B8863E]/20 hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-[#B8863E]/10 flex items-center justify-center">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[#B8863E]/50 text-sm">Belum ada foto</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[#2B2018]">{product.name}</h3>
        <p className="text-[#6B1E23] font-bold mt-1">Rp{product.price.toLocaleString('id-ID')}</p>
        <button
          ref={buttonRef}
          onClick={handleAddToCart}
          className="mt-3 w-full bg-[#6B1E23] text-white rounded-lg py-2 text-sm font-semibold hover:bg-[#4A1418] transition-colors"
        >
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  )
}