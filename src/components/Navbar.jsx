import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-[#FBF5E9]/95 backdrop-blur border-b border-[#B8863E]/25">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-2xl font-semibold text-[#6B1E23]">Deksri Yadnya</span>
        <div className="flex items-center gap-4">
          <span id="cart-icon" className="text-sm font-medium text-[#2B2018] inline-block">
            🛒 Keranjang ({itemCount})
          </span>
          <a href="https://wa.me/6289681297582" target="_blank" rel="noopener noreferrer" className="bg-[#6B1E23] text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-[#4A1418] transition-colors">
            Hubungi Kami
          </a>
        </div>
      </div>
    </header>
  )
}